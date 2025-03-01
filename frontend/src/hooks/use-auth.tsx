"use client";

import { getUserSessionQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useAuth = () => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getUserSessionQueryFn,
    refetchInterval: 60 * 1000 * 15, // 15 minutos
    //staleTime: Number.POSITIVE_INFINITY,
  });
  return query;
};

export default useAuth;
