import { Prisma, type CompetitionLevel, type KeywordCategory, type KeywordIntent, type ProductType, type SourcePlatform } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { KeywordFilters } from "@/lib/types";

function buildWhere(filters: KeywordFilters): Prisma.KeywordWhereInput {
  return {
    canonicalKeyword: filters.search
      ? {
          contains: filters.search.toLowerCase(),
          mode: "insensitive",
        }
      : undefined,
    region: filters.region && filters.region !== "ALL" ? filters.region : undefined,
    category: filters.category && filters.category !== "ALL" ? (filters.category as KeywordCategory) : undefined,
    intent: filters.intent && filters.intent !== "ALL" ? (filters.intent as KeywordIntent) : undefined,
    competitionLevel:
      filters.competitionLevel && filters.competitionLevel !== "ALL"
        ? (filters.competitionLevel as CompetitionLevel)
        : undefined,
    recommendedProductType:
      filters.productType && filters.productType !== "ALL" ? (filters.productType as ProductType) : undefined,
    sourceEvents:
      filters.sourcePlatform && filters.sourcePlatform !== "ALL"
        ? { some: { sourcePlatform: filters.sourcePlatform as SourcePlatform } }
        : undefined,
  };
}

function buildOrderBy(sort: KeywordFilters["sort"]): Prisma.KeywordOrderByWithRelationInput {
  switch (sort) {
    case "growth":
      return { growth30d: "desc" };
    case "demand":
      return { demandScore: "desc" };
    case "monetization":
      return { monetizationScore: "desc" };
    case "opportunity":
    default:
      return { opportunityScore: "desc" };
  }
}

export async function getKeywordExplorerData(filters: KeywordFilters) {
  return prisma.keyword.findMany({
    where: buildWhere(filters),
    include: {
      sourceEvents: {
        select: { sourcePlatform: true },
      },
    },
    orderBy: buildOrderBy(filters.sort),
  });
}

export async function getKeywordDetail(slug: string) {
  return prisma.keyword.findUnique({
    where: { slug },
    include: {
      cluster: true,
      variants: true,
      metrics: { orderBy: { capturedAt: "asc" } },
      sourceEvents: { orderBy: { collectedAt: "desc" } },
      recommendation: true,
      savedBy: true,
    },
  });
}

export async function getFilterOptions() {
  const [regions, categories, intents, productTypes] = await Promise.all([
    prisma.keyword.findMany({ distinct: ["region"], select: { region: true } }),
    prisma.keyword.findMany({ distinct: ["category"], select: { category: true } }),
    prisma.keyword.findMany({ distinct: ["intent"], select: { intent: true } }),
    prisma.keyword.findMany({ distinct: ["recommendedProductType"], select: { recommendedProductType: true } }),
  ]);

  return {
    regions: regions.map((item) => item.region),
    categories: categories.map((item) => item.category),
    intents: intents.map((item) => item.intent),
    productTypes: productTypes.map((item) => item.recommendedProductType),
  };
}
