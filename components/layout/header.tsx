import { Search, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { Input } from "@/components/ui/input";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/60 px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-300">Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}</p>
          <div className="mt-1 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-sky-300">
            <Sparkles className="h-4 w-4" />
            Production-oriented keyword intelligence workspace
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden min-w-[280px] md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input placeholder="Search dashboard, keywords, clusters" className="pl-9" disabled />
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
