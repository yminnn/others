import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-white/10 bg-[var(--panel)] p-5 shadow-[0_24px_48px_rgba(15,23,42,0.35)] backdrop-blur", className)} {...props} />;
}
