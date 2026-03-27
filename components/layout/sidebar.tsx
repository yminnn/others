"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Radar, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/keywords", label: "Keyword Explorer", icon: Radar },
  { href: "/alerts", label: "Alerts & Reports", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-slate-950/40 p-6 lg:flex">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">Opportunity Radar</p>
        <h1 className="mt-3 text-2xl font-semibold text-white">Find startup ideas with signal, not vibes.</h1>
        <p className="mt-3 text-sm text-slate-400">Trend discovery, clustering, scoring, and product recommendation workflows for product builders.</p>
      </div>
      <nav className="mt-10 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} className={cn("flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition", active ? "bg-sky-500/15 text-sky-100" : "text-slate-300 hover:bg-white/5 hover:text-white")}>
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl border border-sky-400/10 bg-sky-400/5 p-4">
        <p className="text-sm font-semibold text-white">Ingestion-ready architecture</p>
        <p className="mt-2 text-sm text-slate-400">Mock collectors are live now and can be swapped with real Google Trends, Reddit, and Product Hunt adapters later.</p>
      </div>
    </aside>
  );
}
