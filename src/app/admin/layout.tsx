import type { ReactNode } from "react";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import AdminMobileNav from "@/src/components/admin/AdminMobileNav";
import AuthGuard from "@/src/components/admin/AuthGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col md:flex-row font-sans antialiased">
      <AdminSidebar />
      <AdminMobileNav />
      <AuthGuard>
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </AuthGuard>
    </div>
  );
}
