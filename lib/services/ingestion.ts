import { SourcePlatform, type Prisma } from "@prisma/client";
import { dedupeKeywordRecords, normalizeKeywordRecords, type RawKeywordRecord } from "@/lib/services/normalization";
import { buildRecommendation } from "@/lib/services/recommendation";
import { scoreKeyword } from "@/lib/services/scoring";

export type CollectorResult = RawKeywordRecord[];

export interface KeywordCollector {
  platform: SourcePlatform;
  collect(): Promise<CollectorResult>;
}

export class GoogleTrendsMockCollector implements KeywordCollector {
  platform = SourcePlatform.GOOGLE_TRENDS;

  async collect() {
    return [
      { keyword: "AI meeting notes", source: this.platform, region: "US", rawScore: 82 },
      { keyword: "SOC2 agent", source: this.platform, region: "US", rawScore: 79 },
    ];
  }
}

export class RedditMockCollector implements KeywordCollector {
  platform = SourcePlatform.REDDIT;

  async collect() {
    return [
      { keyword: "UGC ads library", source: this.platform, region: "US", rawScore: 77 },
      { keyword: "AI compliance agent", source: this.platform, region: "US", rawScore: 74 },
    ];
  }
}

export class ProductHuntMockCollector implements KeywordCollector {
  platform = SourcePlatform.PRODUCT_HUNT;

  async collect() {
    return [
      { keyword: "meeting summary tool", source: this.platform, region: "US", rawScore: 75 },
      { keyword: "creative swipe file", source: this.platform, region: "US", rawScore: 71 },
    ];
  }
}

export const collectors: KeywordCollector[] = [
  new GoogleTrendsMockCollector(),
  new RedditMockCollector(),
  new ProductHuntMockCollector(),
];

export async function runIngestionPipeline() {
  const records = (await Promise.all(collectors.map((collector) => collector.collect()))).flat();
  const normalized = dedupeKeywordRecords(normalizeKeywordRecords(records));

  return normalized.map((record) => {
    const scores = scoreKeyword({
      rawTrend: record.rawScore,
      searchVolume: 4000 + Math.round(record.rawScore * 100),
      validationCount: Math.round(record.rawScore / 3),
      competitionSignals: Math.max(2, Math.round(record.rawScore / 14)),
      pricingPower: Math.max(3, Math.round(record.rawScore / 18)),
      sourceDiversity: 3,
      growthRate30d: record.rawScore / 3,
    });

    return {
      record,
      scores,
      recommendation: buildRecommendation({
        keyword: record.keyword,
        category: "MARKETING",
        intent: "COMMERCIAL",
        competitionLevel: scores.competitionScore > 60 ? "HIGH" : scores.competitionScore > 40 ? "MEDIUM" : "LOW",
        opportunityScore: scores.opportunityScore,
      }),
    } satisfies {
      record: typeof record;
      scores: ReturnType<typeof scoreKeyword>;
      recommendation: ReturnType<typeof buildRecommendation>;
    };
  });
}

export function buildIngestionRunMetadata(resultCount: number): Prisma.InputJsonValue {
  return {
    mode: "mock",
    resultCount,
    collectedAt: new Date().toISOString(),
  };
}
