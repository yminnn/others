"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [errorMessage, action, pending] = useActionState(authenticate, undefined);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-200">Email</label>
        <Input id="email" name="email" type="email" placeholder="founder@opportunityradar.dev" required />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-200">Password</label>
        <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={8} />
      </div>
      {errorMessage ? <p className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{errorMessage}</p> : null}
      <Button type="submit" className="w-full" disabled={pending}>{pending ? "Signing in..." : "Sign in"}</Button>
    </form>
  );
}
