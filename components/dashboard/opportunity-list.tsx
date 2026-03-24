import Link from "next/link";
import type { Keyword } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPercent, formatScore, titleize } from "@/lib/utils/format";

export function OpportunityList({ title, description, items }: { title: string; description: string; items: Keyword[]; }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {items.map((keyword) => (
          <Link key={keyword.id} href={`/keywords/${keyword.slug}`} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-sky-400/30 hover:bg-sky-400/5">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-white">{keyword.canonicalKeyword}</p>
                <Badge tone={keyword.competitionLevel === "LOW" ? "positive" : keyword.competitionLevel === "MEDIUM" ? "warning" : "danger"}>{titleize(keyword.competitionLevel)}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-400">{titleize(keyword.category)} • {titleize(keyword.intent)} • {titleize(keyword.recommendedProductType)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Opportunity</p>
              <p className="text-lg font-semibold text-white">{formatScore(keyword.opportunityScore.toString())}</p>
              <p className="text-xs text-emerald-300">{formatPercent(Number(keyword.growth30d))}</p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
