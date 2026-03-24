import * as React from "react";
import { cn } from "@/lib/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "outline" | "danger";
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "default" && "bg-sky-500 text-slate-950 hover:bg-sky-400",
        variant === "ghost" && "bg-transparent text-slate-100 hover:bg-white/5",
        variant === "outline" && "border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10",
        variant === "danger" && "bg-rose-500 text-white hover:bg-rose-400",
        className,
      )}
      {...props}
    />
  );
}
