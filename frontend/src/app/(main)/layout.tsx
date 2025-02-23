"use client";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Asidebar from "./_components/Asidebar";
import Header from "./_components/Header";
import { AuthProvider } from "@/context/auth-provider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Asidebar />
        <SidebarInset>
          <main className="w-full">
            <Header />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
