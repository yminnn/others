"use client";

import { Button } from "@/components/ui/button";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  return (
    <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-8">
      <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
      <p className="mt-3 text-sm text-rose-100/90">{error.message}</p>
      <Button className="mt-4" onClick={() => reset()}>Try again</Button>
    </div>
  );
}
