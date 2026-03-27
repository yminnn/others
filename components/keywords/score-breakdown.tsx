import { Card } from "@/components/ui/card";
import { formatScore } from "@/lib/utils/format";

export function ScoreBreakdown({
  scores,
}: {
  scores: Array<{ label: string; value: number; helper: string }>;
}) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-white">Score breakdown</h3>
      <div className="mt-5 space-y-4">
        {scores.map((score) => (
          <div key={score.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-300">{score.label}</span>
              <span className="font-semibold text-white">{formatScore(score.value)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-sky-400" style={{ width: `${score.value}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-500">{score.helper}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
