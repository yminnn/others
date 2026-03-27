import Link from "next/link";
import type { Keyword, KeywordSourceEvent } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPercent, formatScore, titleize } from "@/lib/utils/format";

type KeywordRow = Keyword & { sourceEvents: Pick<KeywordSourceEvent, "sourcePlatform">[] };

export function KeywordTable({ keywords }: { keywords: KeywordRow[] }) {
  if (!keywords.length) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-white">No keywords match these filters</h3>
        <p className="mt-2 text-sm text-slate-400">Try broadening your search, region, or competition thresholds.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-400">
            <tr>
              {['Keyword', 'Category', 'Intent', 'Sources', 'Growth', 'Demand', 'Monetization', 'Opportunity'].map((heading) => (
                <th key={heading} className="px-5 py-4 font-medium">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keywords.map((keyword) => (
              <tr key={keyword.id} className="border-t border-white/10 text-slate-200">
                <td className="px-5 py-4">
                  <Link href={`/keywords/${keyword.slug}`} className="block">
                    <p className="font-medium text-white">{keyword.canonicalKeyword}</p>
                    <p className="mt-1 text-xs text-slate-500">{titleize(keyword.recommendedProductType)} • {keyword.region}</p>
                  </Link>
                </td>
                <td className="px-5 py-4">{titleize(keyword.category)}</td>
                <td className="px-5 py-4">{titleize(keyword.intent)}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(keyword.sourceEvents.map((source) => source.sourcePlatform))].map((source) => (
                      <Badge key={source}>{titleize(source)}</Badge>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4 text-emerald-300">{formatPercent(Number(keyword.growth30d))}</td>
                <td className="px-5 py-4">{formatScore(keyword.demandScore.toString())}</td>
                <td className="px-5 py-4">{formatScore(keyword.monetizationScore.toString())}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{formatScore(keyword.opportunityScore.toString())}</span>
                    <Badge tone={keyword.competitionLevel === "LOW" ? "positive" : keyword.competitionLevel === "MEDIUM" ? "warning" : "danger"}>{titleize(keyword.competitionLevel)}</Badge>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
