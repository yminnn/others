import { ArrowUpRight } from "lucide-react";
import type { DashboardKpi } from "@/lib/types";
import { Card } from "@/components/ui/card";

export function KpiGrid({ items }: { items: DashboardKpi[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title}>
          <p className="text-sm text-slate-400">{item.title}</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="text-3xl font-semibold text-white">{item.value}</p>
            <div className="flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-200">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {item.delta}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
