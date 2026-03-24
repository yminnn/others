import { CompetitionLevel, KeywordCategory, ProductType, type KeywordIntent } from "@prisma/client";

export type RecommendationInput = {
  keyword: string;
  category: KeywordCategory;
  intent: KeywordIntent;
  competitionLevel: CompetitionLevel;
  opportunityScore: number;
};

export function recommendProductType(input: RecommendationInput): ProductType {
  if (input.category === KeywordCategory.DEVELOPER_TOOLS || input.intent === "TRANSACTIONAL") {
    return ProductType.SAAS;
  }

  if (input.category === KeywordCategory.MARKETING && input.competitionLevel === CompetitionLevel.LOW) {
    return ProductType.SAAS;
  }

  if (input.category === KeywordCategory.COMMUNITY) {
    return ProductType.COMMUNITY;
  }

  return input.opportunityScore > 75 ? ProductType.SAAS : ProductType.MOBILE_APP;
}

export function buildRecommendation(input: RecommendationInput) {
  const productType = recommendProductType(input);
  const targetUsers =
    input.category === KeywordCategory.MARKETING
      ? ["Growth marketers", "Founders", "Agencies"]
      : input.category === KeywordCategory.DEVELOPER_TOOLS
        ? ["Engineering leaders", "Platform teams", "B2B founders"]
        : ["Operators", "Product builders", "Indie hackers"];

  return {
    recommendedProductType: productType,
    headline: `Build a ${productType.toLowerCase().replace("_", " ")} around ${input.keyword} with a focused workflow angle.`,
    targetUsers,
    mvpFeatures: [
      "Weekly signal dashboard",
      "Validation evidence feed",
      "Segment-specific workflow templates",
      "Saved opportunities and alerts",
    ],
    monetizationModel: ["Monthly subscription", "Premium reports", "Team plan"],
    risks: ["Trend may cool", "Need source freshness", "Positioning must stay narrow"],
    differentiation: "Use signal freshness and product-builder-specific recommendations to stay actionable.",
  };
}
