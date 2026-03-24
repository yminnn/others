import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("h-11 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100", className)} {...props} />;
}
