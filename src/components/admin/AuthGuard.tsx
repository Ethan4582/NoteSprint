"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated } from "@/src/lib/admin-api";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (pathname !== "/admin/login" && !isAuthenticated()) {
      router.replace("/admin/login");
    }
  }, [pathname, router]);

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center" />;
  }

  if (pathname !== "/admin/login" && !isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}
