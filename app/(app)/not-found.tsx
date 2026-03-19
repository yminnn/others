import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--panel)] p-8">
      <h2 className="text-xl font-semibold text-white">Keyword not found</h2>
      <p className="mt-3 text-sm text-slate-400">The requested opportunity may have been removed or filtered out.</p>
      <Link href="/keywords" className="mt-4 inline-block">
        <Button>Back to explorer</Button>
      </Link>
    </div>
  );
}
