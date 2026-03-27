import type { AlertSeverity, CompetitionLevel, KeywordCategory, KeywordIntent, ProductType, SourcePlatform, TrendType } from "@prisma/client";

export type KeywordFilters = {
  search?: string;
  region?: string;
  sourcePlatform?: SourcePlatform | "ALL";
  category?: KeywordCategory | "ALL";
  intent?: KeywordIntent | "ALL";
  competitionLevel?: CompetitionLevel | "ALL";
  productType?: ProductType | "ALL";
  sort?: "opportunity" | "growth" | "demand" | "monetization";
};

export type DashboardKpi = {
  title: string;
  value: string;
  delta: string;
  tone: "positive" | "neutral" | "warning";
};

export type AlertItem = {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  createdAt: Date;
};

export type TrendPoint = {
  date: string;
  opportunityScore: number;
  trendScore: number;
};

export type RecommendationView = {
  headline: string;
  recommendedProductType: ProductType;
  targetUsers: string[];
  mvpFeatures: string[];
  monetizationModel: string[];
  risks: string[];
  differentiation: string;
};

export type ExplorerRow = {
  id: string;
  slug: string;
  canonicalKeyword: string;
  category: KeywordCategory;
  intent: KeywordIntent;
  region: string;
  trendType: TrendType;
  recommendedProductType: ProductType;
  competitionLevel: CompetitionLevel;
  opportunityScore: number;
  demandScore: number;
  monetizationScore: number;
  growth30d: number;
  sourcePlatforms: SourcePlatform[];
};
