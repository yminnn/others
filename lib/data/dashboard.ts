import { CompetitionLevel } from "@prisma/client";
import { subDays, format } from "date-fns";
import { prisma } from "@/lib/db";
import type { DashboardKpi, TrendPoint } from "@/lib/types";
import { formatCompactNumber } from "@/lib/utils/format";

export async function getDashboardData(userId: string) {
  const [keywordCount, avgOpportunity, recentKeywords, lowCompetition, alerts, savedCount, trendMetrics] = await Promise.all([
    prisma.keyword.count(),
    prisma.keyword.aggregate({ _avg: { opportunityScore: true } }),
    prisma.keyword.findMany({ orderBy: { updatedAt: "desc" }, take: 5, include: { sourceEvents: true } }),
    prisma.keyword.findMany({ where: { competitionLevel: CompetitionLevel.LOW }, orderBy: { opportunityScore: "desc" }, take: 5 }),
    prisma.alert.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.savedKeyword.count({ where: { userId } }),
    prisma.keywordMetric.findMany({
      where: { capturedAt: { gte: subDays(new Date(), 28) } },
      orderBy: { capturedAt: "asc" },
      include: { keyword: true },
    }),
  ]);

  const kpis: DashboardKpi[] = [
    { title: "Tracked keywords", value: String(keywordCount), delta: "+3 this week", tone: "positive" },
    { title: "Average opportunity", value: `${Number(avgOpportunity._avg.opportunityScore ?? 0).toFixed(0)}/100`, delta: "+6.4% vs last cycle", tone: "positive" },
    { title: "Saved opportunities", value: String(savedCount), delta: "Portfolio ready", tone: "neutral" },
    { title: "30d search demand", value: formatCompactNumber(trendMetrics.reduce((total, item) => total + item.searchVolume, 0)), delta: "Across active signals", tone: "neutral" },
  ];

  const groupedTrend = trendMetrics.reduce<Record<string, { opportunityScore: number; trendScore: number; count: number }>>((acc, metric) => {
    const key = format(metric.capturedAt, "MMM d");
    acc[key] ??= { opportunityScore: 0, trendScore: 0, count: 0 };
    acc[key].opportunityScore += Number(metric.opportunityScore);
    acc[key].trendScore += Number(metric.trendScore);
    acc[key].count += 1;
    return acc;
  }, {});

  const trendChart: TrendPoint[] = Object.entries(groupedTrend).map(([date, values]) => ({
    date,
    opportunityScore: Number((values.opportunityScore / values.count).toFixed(1)),
    trendScore: Number((values.trendScore / values.count).toFixed(1)),
  }));

  return {
    kpis,
    recentKeywords,
    lowCompetition,
    alerts,
    trendChart,
  };
}
