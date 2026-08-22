import type { ReactNode } from "react";
import AdminNav from "@/src/components/admin/AdminNav";
import AuthGuard from "@/src/components/admin/AuthGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col font-sans">
      <AdminNav />
      <AuthGuard>
        <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </AuthGuard>
    </div>
  );
}
