"use client";
import React, { useCallback } from "react";
import SessionItem from "./SessionItem";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sessionDeleteMutationFn, sessionQueryFn } from "@/lib/api";
import { Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Sessions = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["sessions"],
    queryFn: sessionQueryFn,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: sessionDeleteMutationFn,
  });

  const sessions = data?.sessions || [];
  const currentSession = sessions?.find((session) => session.isCurrent);

  const otherSessions = sessions?.filter(
    (session) => session.isCurrent === undefined
  );

  console.log(otherSessions);

  const handleDelete = useCallback(
    (id: string) => {
      mutate(id, {
        onSuccess: () => {
          refetch();
          toast({
            title: "Success",
            description: "Session removed succesfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
      });
    },
    [mutate, refetch]
  );

  return (
    <div className="via-root to-root rounded-xl bg-gradient-to-r p-0.5">
      <div className="rounded-[10px] p-6">
        <h3 className="text-xl tracking-[-0.16px] text-slate-12 font-bold mb-1">
          Sessions
        </h3>
        <p className="mb-6 max-w-xl text-sm text-[#0007149f] dark:text-gray-100 font-normal">
          Sessions are the devices you are using or that have used your Squeezy
          These are the sessions where your account is currently logged in. You
          can log out of each session.
        </p>
        {isLoading ? (
          <Loader size="35px" className="animate-spin" />
        ) : (
          <div className="rounded-t-xl max-w-xl">
            <div>
              <h5 className="text-base font-semibold">
                Current active session
              </h5>
              <p className="mb-6 text-sm text-[#0007149f] dark:text-gray-100">
                You’re logged into this Squeezy account on this device and are
                currently using it.
              </p>
            </div>
            <div className="w-full">
              {currentSession && (
                <div className="w-full py-2 border-b pb-5">
                  <SessionItem
                    userAgent={currentSession.userAgent}
                    date={currentSession.createdAt}
                    isCurrent={currentSession.isCurrent}
                  />
                </div>
              )}

              <div className="mt-4">
                <h5 className="text-base font-semibold">Other sessions</h5>
                <ul className="mt-4 w-full space-y-3 max-h-[400px] overflow-y-auto">
                  {otherSessions.map((session) => (
                    <li key={session._id}>
                      <SessionItem
                        loading={isPending}
                        userAgent={session.userAgent}
                        date={session.createdAt}
                        onRemove={() => handleDelete(session._id)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;
