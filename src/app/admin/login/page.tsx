"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { adminLogin } from "@/src/lib/admin-api";
import { Lock, Loader2, KeyRound, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError(null);

    const res = await adminLogin(password.trim());
    if (res.success) {
      router.push("/admin");
    } else {
      setError(res.error || "Invalid password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[var(--border)] rounded-lg p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20 shadow-xs">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-normal font-serif tracking-tight text-[var(--text-primary)]">
            Admin Access
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Enter your admin PIN to access the NoteSprint management dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="rounded-md bg-rose-50 border border-rose-200 p-3 text-xs text-rose-600 font-medium text-center">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Password PIN
            </label>
            <div className="relative flex items-center">
              <KeyRound className="absolute left-3.5 h-4 w-4 text-[var(--text-muted)] pointer-events-none z-10" />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
                autoFocus
                className="pl-10 pr-10 text-sm font-mono h-11 rounded-md bg-white border-[var(--border)] shadow-xs focus:ring-2 focus:ring-[var(--accent)]/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus:outline-none p-1 z-10"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-md font-bold text-xs uppercase tracking-wider bg-[var(--text-primary)] hover:bg-black text-white shadow-md active:scale-95 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Verifying PIN...
              </>
            ) : (
              <span className="flex items-center gap-1.5">
                <span>Unlock Console</span>
                <ArrowRight size={14} />
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
