"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function SubscribeForm({ compact = false, onSuccess }: { compact?: boolean; onSuccess?: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("subscribers").insert({ email });

    if (error) {
      if (error.code === "23505") {
        toast.error("You're already subscribed!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } else {
      toast.success("Subscribed! You'll hear from us when we publish.");
      setEmail("");
      if (onSuccess) {
        onSuccess();
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`rounded-full flex-1 bg-white/50 backdrop-blur-sm ${compact ? "h-9 text-sm px-4" : "h-[48px] px-6"}`}
        required
        suppressHydrationWarning
      />
      <Button
        type="submit"
        disabled={loading}
        className={compact ? "h-9 text-sm px-4" : "h-[48px] px-8"}
      >
        {loading ? "..." : "Subscribe"}
      </Button>
    </form>
  );
}
