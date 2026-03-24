import { cn } from "@/lib/utils/cn";

export function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "positive" | "warning" | "danger"; }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        tone === "default" && "border-white/10 bg-white/5 text-slate-200",
        tone === "positive" && "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
        tone === "warning" && "border-amber-400/20 bg-amber-500/10 text-amber-200",
        tone === "danger" && "border-rose-400/20 bg-rose-500/10 text-rose-200",
      )}
    >
      {children}
    </span>
  );
}
