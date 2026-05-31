"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, Briefcase } from "lucide-react";

export default function BottomNav({ onRead, isReadDisabled = false }: { onRead?: () => void, isReadDisabled?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[var(--bg-subtle)] border-t border-[var(--border-outer)] pb-safe shadow-inset-cavity z-50">
      <div className="max-w-[600px] mx-auto flex items-center justify-evenly px-6 h-16">
        
        {/* Home Button Inset Well */}
        <div className="h-full py-1.5 px-4 flex items-center justify-center">
          <button 
            onClick={() => router.push("/dashboard")} 
            className={`flex flex-col items-center justify-center gap-1 w-16 h-full rounded-2xl transition-all ${
              pathname === "/dashboard" 
                ? "bg-raised shadow-raised-crisp text-[var(--accent)] border border-[var(--border-strong)] drop-shadow-[0_0_5px_rgba(255,69,0,0.3)] z-10 scale-105" 
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-black tracking-widest uppercase">Home</span>
          </button>
        </div>

        {/* Interview Button Inset Well */}
        <div className="h-full py-1.5 px-4 flex items-center justify-center">
          <button 
            onClick={() => router.push("/interview")} 
            className={`flex flex-col items-center justify-center gap-1 w-16 h-full rounded-2xl transition-all ${
              pathname === "/interview" 
                ? "bg-raised shadow-raised-crisp text-[var(--accent)] border border-[var(--border-strong)] drop-shadow-[0_0_5px_rgba(255,69,0,0.3)] z-10 scale-105" 
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-[9px] font-black tracking-widest uppercase">Prep</span>
          </button>
        </div>

      </div>
    </div>
  );
}
