"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, LayoutList, BookOpen } from "lucide-react";

export default function BottomNav({ onRead, isReadDisabled = false }: { onRead?: () => void, isReadDisabled?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[var(--bg-surface)] border-t border-[var(--border)] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
      <div className="max-w-[600px] mx-auto flex items-center px-6 h-16">
        
        <div className="flex flex-1 justify-evenly items-center">
        <button 
          onClick={() => router.push("/dashboard")} 
          className={`flex flex-col items-center gap-1 flex-1 transition-all ${
            pathname === "/dashboard" ? "text-[var(--accent)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${
            pathname === "/dashboard" ? "bg-[var(--accent-subtle)]" : ""
          }`}>
            <Home className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase">Home</span>
        </button>

        <button 
          onClick={() => {
            if (onRead) {
              onRead();
            } else {
              router.push("/read");
            }
          }} 
          className={`flex flex-col items-center gap-1 flex-1 transition-all ${
            pathname.startsWith("/preview") || pathname === "/read" ? "text-[var(--accent)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          } ${isReadDisabled && onRead ? "opacity-30 grayscale cursor-not-allowed" : ""}`}
          disabled={isReadDisabled && !!onRead}
        >
          <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${
            pathname.startsWith("/preview") || pathname === "/read" ? "bg-[var(--accent-subtle)]" : "bg-[var(--bg-subtle)]"
          }`}>
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase">Read</span>
        </button>
        
        <button 
          onClick={() => router.push("/practice")} 
          className={`flex flex-col items-center gap-1 flex-1 transition-all ${
            pathname === "/practice" ? "text-[var(--accent)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${
            pathname === "/practice" ? "bg-[var(--accent-subtle)]" : ""
          }`}>
            <LayoutList className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase">Practice</span>
        </button>
        </div>
      </div>
    </div>
  );
}
