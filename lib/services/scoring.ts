export type ScoreInput = {
  rawTrend: number;
  searchVolume: number;
  validationCount: number;
  competitionSignals: number;
  pricingPower: number;
  sourceDiversity: number;
  growthRate30d: number;
};

export type ScoreResult = {
  trendScore: number;
  demandScore: number;
  competitionScore: number;
  monetizationScore: number;
  opportunityScore: number;
};

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export function calculateTrendScore(input: ScoreInput) {
  return clamp(input.rawTrend * 0.55 + input.growthRate30d * 1.2 + input.sourceDiversity * 6);
}

export function calculateDemandScore(input: ScoreInput) {
  return clamp(input.searchVolume / 180 + input.validationCount * 1.6 + input.sourceDiversity * 4);
}

export function calculateCompetitionScore(input: ScoreInput) {
  return clamp(input.competitionSignals * 10);
}

export function calculateMonetizationScore(input: ScoreInput) {
  return clamp(input.pricingPower * 14 + input.validationCount * 0.7);
}

export function calculateOpportunityScore(scores: Omit<ScoreResult, "opportunityScore">) {
  return clamp(scores.trendScore * 0.3 + scores.demandScore * 0.3 + (100 - scores.competitionScore) * 0.15 + scores.monetizationScore * 0.25);
}

export function scoreKeyword(input: ScoreInput): ScoreResult {
  const trendScore = calculateTrendScore(input);
  const demandScore = calculateDemandScore(input);
  const competitionScore = calculateCompetitionScore(input);
  const monetizationScore = calculateMonetizationScore(input);
  const opportunityScore = calculateOpportunityScore({ trendScore, demandScore, competitionScore, monetizationScore });

  return {
    trendScore,
    demandScore,
    competitionScore,
    monetizationScore,
    opportunityScore,
  };
}

export const scoringFormula = {
  trend: "rawTrend * 0.55 + growthRate30d * 1.2 + sourceDiversity * 6",
  demand: "searchVolume / 180 + validationCount * 1.6 + sourceDiversity * 4",
  competition: "competitionSignals * 10",
  monetization: "pricingPower * 14 + validationCount * 0.7",
  opportunity: "trend*0.3 + demand*0.3 + (100-competition)*0.15 + monetization*0.25",
};
