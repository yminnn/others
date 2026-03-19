import { RunIngestionButton } from "@/components/dashboard/run-ingestion-button";
import { auth } from "@/auth";
import { getSettingsData } from "@/lib/data/settings";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { scoringFormula } from "@/lib/services/scoring";
import { titleize } from "@/lib/utils/format";

export default async function SettingsPage() {
  const session = await auth();
  const data = await getSettingsData(session!.user.id);

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Settings" title="Workspace configuration" description="Inspect the seed account, recent saved ideas, and ingestion runtime metadata for deployment readiness." />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <h3 className="text-lg font-semibold text-white">Account</h3>
          <p className="mt-4 text-sm text-slate-400">Signed in as</p>
          <p className="mt-1 text-lg font-semibold text-white">{data.user?.email}</p>
          <p className="mt-4 text-sm text-slate-400">Saved keywords</p>
          <p className="mt-1 text-lg font-semibold text-white">{data.savedKeywords.length}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-white">Saved opportunities</h3>
          <div className="mt-4 space-y-3">
            {data.savedKeywords.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="font-medium text-white">{entry.keyword.canonicalKeyword}</p>
                <p className="mt-1 text-sm text-slate-400">Opportunity {entry.keyword.opportunityScore.toString()} • {titleize(entry.keyword.recommendedProductType)}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-white">Recent ingestion runs</h3>
          <div className="mt-4 space-y-3">
            {data.ingestionRuns.map((run) => (
              <div key={run.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{titleize(run.sourcePlatform)}</p>
                  <Badge>{run.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-400">{run.recordsAccepted}/{run.recordsCollected} records accepted</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Scoring formulas</h3>
            <p className="mt-1 text-sm text-slate-400">Opportunity Radar keeps the ranking model explicit so teams can inspect and tune the logic.</p>
          </div>
          <RunIngestionButton />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Object.entries(scoringFormula).map(([key, formula]) => (
            <div key={key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium text-white">{titleize(key)}</p>
              <p className="mt-2 text-sm text-slate-400">{formula}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
