"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="w-full max-w-sm rounded-3xl bg-white p-10 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-neutral-100">
        <div className="flex justify-center mb-10">
          <Logo />
        </div>
        <h1 className="text-[22px] font-semibold text-center text-neutral-900 mb-8 tracking-tight">
          Admin Sign In
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-2xl h-12 bg-neutral-50/50 border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 focus-visible:bg-white transition-all shadow-none"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-2xl h-12 bg-neutral-50/50 border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 focus-visible:bg-white transition-all shadow-none"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl h-12 bg-neutral-900 text-white hover:bg-neutral-800 font-medium transition-colors shadow-none mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
          {error && (
            <p className="text-sm text-red-500 text-center font-medium mt-2">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
