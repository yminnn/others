import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getKeywordDetail } from "@/lib/data/keywords";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DetailChart } from "@/components/keywords/detail-chart";
import { ScoreBreakdown } from "@/components/keywords/score-breakdown";
import { SectionHeader } from "@/components/ui/section-header";
import { formatCompactNumber, formatPercent, formatScore, titleize } from "@/lib/utils/format";

export default async function KeywordDetailPage({ params }: { params: Promise<{ id: string }>; }) {
  const { id } = await params;
  const keyword = await getKeywordDetail(id);

  if (!keyword) {
    notFound();
  }

  const chartData = keyword.metrics.map((metric) => ({
    date: format(metric.capturedAt, "MMM d"),
    opportunityScore: Number(metric.opportunityScore),
    searchVolume: metric.searchVolume,
  }));

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Keyword detail" title={keyword.canonicalKeyword} description={keyword.description} />
      <div className="flex flex-wrap gap-2">
        <Badge>{titleize(keyword.category)}</Badge>
        <Badge>{titleize(keyword.intent)}</Badge>
        <Badge tone={keyword.competitionLevel === "LOW" ? "positive" : keyword.competitionLevel === "MEDIUM" ? "warning" : "danger"}>{titleize(keyword.competitionLevel)} competition</Badge>
        <Badge>{titleize(keyword.trendType)}</Badge>
        <Badge>{keyword.region}</Badge>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DetailChart data={chartData} />
        <ScoreBreakdown
          scores={[
            { label: "Trend strength", value: Number(keyword.trendScore), helper: "Signal momentum across collectors and 30d acceleration." },
            { label: "Demand strength", value: Number(keyword.demandScore), helper: "Estimated search demand plus validation evidence." },
            { label: "Competition level", value: Number(keyword.competitionScore), helper: "Higher is harder; saturated categories score closer to 100." },
            { label: "Monetization potential", value: Number(keyword.monetizationScore), helper: "Pricing power based on buyer pain and commercial intent." },
            { label: "Overall opportunity", value: Number(keyword.opportunityScore), helper: "Weighted score balancing upside, demand durability, and crowding." },
          ]}
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h3 className="text-lg font-semibold text-white">Opportunity profile</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Variants", String(keyword.variants.length)],
              ["Source platforms", String(new Set(keyword.sourceEvents.map((event) => event.sourcePlatform)).size)],
              ["Search volume", formatCompactNumber(keyword.searchVolumeEstimate)],
              ["Growth (30d)", formatPercent(Number(keyword.growth30d))],
              ["Growth (90d)", formatPercent(Number(keyword.growth90d))],
              ["Validation count", String(keyword.validationCount)],
              ["Long-tail keywords", String(keyword.longTailCount)],
              ["Source mentions", String(keyword.sourceCount)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-slate-300">Variants</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {keyword.variants.map((variant) => <Badge key={variant.id}>{variant.variant}</Badge>)}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">Source events</p>
              <div className="mt-3 space-y-3">
                {keyword.sourceEvents.map((event) => (
                  <div key={event.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-white">{event.rawKeyword}</p>
                      <Badge>{titleize(event.sourcePlatform)}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">Raw score {formatScore(event.rawScore.toString())} • collected {format(event.collectedAt, "MMM d, yyyy")}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-white">Recommendation engine output</h3>
          {keyword.recommendation ? (
            <div className="mt-5 space-y-5">
              <div>
                <p className="text-sm font-medium text-sky-200">{keyword.recommendation.headline}</p>
                <p className="mt-2 text-sm text-slate-400">Recommended product type: {titleize(keyword.recommendation.recommendedProductType)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Target users</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-400">
                  {keyword.recommendation.targetUsers.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">MVP features</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-400">
                  {keyword.recommendation.mvpFeatures.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Monetization model</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-400">
                  {keyword.recommendation.monetizationModel.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Risks</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-400">
                  {keyword.recommendation.risks.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Differentiation</p>
                <p className="mt-2 text-sm text-slate-400">{keyword.recommendation.differentiation}</p>
              </div>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
