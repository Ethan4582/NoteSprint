"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { adminLogin } from "@/src/lib/admin-api";
import { Lock, Loader2, KeyRound, Eye, EyeOff } from "lucide-react";

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
      <Card className="w-full max-w-md border border-[var(--border-strong)] bg-raised shadow-raised-crisp">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 shadow-sm">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-black tracking-tight">Admin Access</CardTitle>
          <CardDescription className="text-xs">
            Enter your admin PIN / password to access the management dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-[var(--error)] font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Password
              </label>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-3.5 h-4 w-4 text-[var(--text-muted)] pointer-events-none z-10" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  required
                  autoFocus
                  className="pl-10 pr-10 text-sm tracking-wide font-mono w-full"
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

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                "Unlock Dashboard"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
