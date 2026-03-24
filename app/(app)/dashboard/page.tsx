import { auth } from "@/auth";
import { getDashboardData } from "@/lib/data/dashboard";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { OpportunityList } from "@/components/dashboard/opportunity-list";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { SectionHeader } from "@/components/ui/section-header";

export default async function DashboardPage() {
  const session = await auth();
  const data = await getDashboardData(session!.user.id);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Dashboard"
        title="Keyword opportunity overview"
        description="Track the most investable startup ideas, monitor lower-competition pockets, and catch significant signal shifts before the market saturates."
      />
      <KpiGrid items={data.kpis} />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <TrendChart data={data.trendChart} />
        <AlertsPanel alerts={data.alerts} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <OpportunityList title="Recent opportunities" description="Most recently refreshed keywords and clusters in your workspace." items={data.recentKeywords} />
        <OpportunityList title="Low competition pockets" description="Keywords with favorable upside and lower saturation." items={data.lowCompetition} />
      </div>
    </div>
  );
}
