import { PrismaClient, Prisma, KeywordCategory, KeywordIntent, TrendType, CompetitionLevel, ProductType, SourcePlatform, IngestionStatus, AlertSeverity } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const metrics = (entries: Array<{ daysAgo: number; opportunityScore: number; trendScore: number; demandScore: number; competitionScore: number; monetizationScore: number; growthRate: number; searchVolume: number; validationCount: number; }>) => entries;

const keywords = [
  {
    slug: "ai-meeting-notes",
    canonicalKeyword: "ai meeting notes",
    category: KeywordCategory.PRODUCTIVITY,
    intent: KeywordIntent.PROBLEM_AWARE,
    trendType: TrendType.STEADY_GROWTH,
    competitionLevel: CompetitionLevel.MEDIUM,
    recommendedProductType: ProductType.SAAS,
    region: "US",
    description: "Teams are looking for automated note taking, summaries, and follow-up extraction from calls.",
    validationCount: 42,
    sourceCount: 3,
    longTailCount: 18,
    variantCount: 4,
    trendScore: 82,
    demandScore: 78,
    competitionScore: 54,
    monetizationScore: 83,
    opportunityScore: 81,
    growth30d: 22.4,
    growth90d: 48.7,
    searchVolumeEstimate: 12800,
    cluster: {
      slug: "meeting-automation",
      canonicalKeyword: "meeting automation",
      summary: "Workflow automation for call capture, summarization, and team follow-up.",
    },
    variants: [
      { variant: "AI meeting notes", normalized: "ai meeting notes", sourcePlatform: SourcePlatform.GOOGLE_TRENDS },
      { variant: "meeting notes ai", normalized: "meeting notes ai", sourcePlatform: SourcePlatform.REDDIT },
      { variant: "meeting summary tool", normalized: "meeting summary tool", sourcePlatform: SourcePlatform.PRODUCT_HUNT },
      { variant: "meeting transcription app", normalized: "meeting transcription app", sourcePlatform: SourcePlatform.GOOGLE_TRENDS },
    ],
    metrics: metrics([
      { daysAgo: 28, opportunityScore: 68, trendScore: 72, demandScore: 70, competitionScore: 50, monetizationScore: 77, growthRate: 12.2, searchVolume: 9400, validationCount: 30 },
      { daysAgo: 21, opportunityScore: 72, trendScore: 76, demandScore: 72, competitionScore: 52, monetizationScore: 79, growthRate: 15.8, searchVolume: 10200, validationCount: 33 },
      { daysAgo: 14, opportunityScore: 76, trendScore: 79, demandScore: 75, competitionScore: 53, monetizationScore: 81, growthRate: 18.4, searchVolume: 11200, validationCount: 36 },
      { daysAgo: 7, opportunityScore: 79, trendScore: 81, demandScore: 77, competitionScore: 54, monetizationScore: 82, growthRate: 20.6, searchVolume: 11900, validationCount: 39 },
      { daysAgo: 0, opportunityScore: 81, trendScore: 82, demandScore: 78, competitionScore: 54, monetizationScore: 83, growthRate: 22.4, searchVolume: 12800, validationCount: 42 },
    ]),
    recommendation: {
      recommendedProductType: ProductType.SAAS,
      headline: "Build a meeting intelligence SaaS for founder-led and revenue teams.",
      targetUsers: ["Startup founders", "Sales leaders", "Customer success teams"],
      mvpFeatures: ["Call transcription upload", "AI summaries with action items", "CRM sync for follow-ups", "Team searchable meeting archive"],
      monetizationModel: ["Per seat subscription", "Usage-based transcription overage", "Annual workspace plan"],
      risks: ["Crowded AI notes space", "Need strong workflow integrations", "Retention depends on accuracy"],
      differentiation: "Focus on post-meeting execution workflows instead of generic note generation.",
    },
  },
  {
    slug: "ugc-ads-library",
    canonicalKeyword: "ugc ads library",
    category: KeywordCategory.MARKETING,
    intent: KeywordIntent.COMMERCIAL,
    trendType: TrendType.BREAKOUT,
    competitionLevel: CompetitionLevel.LOW,
    recommendedProductType: ProductType.SAAS,
    region: "US",
    description: "Brands and agencies want searchable inspiration for high-performing UGC ads.",
    validationCount: 28,
    sourceCount: 3,
    longTailCount: 11,
    variantCount: 3,
    trendScore: 88,
    demandScore: 72,
    competitionScore: 36,
    monetizationScore: 76,
    opportunityScore: 84,
    growth30d: 31.8,
    growth90d: 69.2,
    searchVolumeEstimate: 7600,
    cluster: {
      slug: "creative-intelligence",
      canonicalKeyword: "creative intelligence",
      summary: "Tools that help marketers discover, benchmark, and improve ad creatives.",
    },
    variants: [
      { variant: "UGC ads library", normalized: "ugc ads library", sourcePlatform: SourcePlatform.PRODUCT_HUNT },
      { variant: "ad creative swipe file", normalized: "ad creative swipe file", sourcePlatform: SourcePlatform.REDDIT },
      { variant: "tiktok ad library for ugc", normalized: "tiktok ad library for ugc", sourcePlatform: SourcePlatform.GOOGLE_TRENDS },
    ],
    metrics: metrics([
      { daysAgo: 28, opportunityScore: 60, trendScore: 64, demandScore: 61, competitionScore: 34, monetizationScore: 67, growthRate: 11.9, searchVolume: 4200, validationCount: 18 },
      { daysAgo: 21, opportunityScore: 68, trendScore: 72, demandScore: 65, competitionScore: 35, monetizationScore: 70, growthRate: 18.3, searchVolume: 5100, validationCount: 21 },
      { daysAgo: 14, opportunityScore: 74, trendScore: 78, demandScore: 68, competitionScore: 35, monetizationScore: 72, growthRate: 24.4, searchVolume: 5900, validationCount: 24 },
      { daysAgo: 7, opportunityScore: 80, trendScore: 84, demandScore: 71, competitionScore: 36, monetizationScore: 75, growthRate: 29.1, searchVolume: 6900, validationCount: 27 },
      { daysAgo: 0, opportunityScore: 84, trendScore: 88, demandScore: 72, competitionScore: 36, monetizationScore: 76, growthRate: 31.8, searchVolume: 7600, validationCount: 28 },
    ]),
    recommendation: {
      recommendedProductType: ProductType.SAAS,
      headline: "Create a creative research platform for e-commerce growth teams.",
      targetUsers: ["Paid media buyers", "E-commerce founders", "Creative strategists"],
      mvpFeatures: ["Searchable ad examples", "Hooks and CTA tagging", "Brand and channel filters", "Weekly winning creative alerts"],
      monetizationModel: ["Team subscription tiers", "Premium reports", "Agency seats"],
      risks: ["Need consistent data acquisition", "Potential platform policy changes", "Moderate churn risk if freshness drops"],
      differentiation: "Index ad creative patterns and offer reusable hooks, angles, and landing page mappings.",
    },
  },
  {
    slug: "soc2-agent",
    canonicalKeyword: "soc2 agent",
    category: KeywordCategory.DEVELOPER_TOOLS,
    intent: KeywordIntent.TRANSACTIONAL,
    trendType: TrendType.BREAKOUT,
    competitionLevel: CompetitionLevel.MEDIUM,
    recommendedProductType: ProductType.SAAS,
    region: "US",
    description: "Security and compliance automation is attracting strong interest from AI-native startups.",
    validationCount: 36,
    sourceCount: 3,
    longTailCount: 13,
    variantCount: 4,
    trendScore: 86,
    demandScore: 80,
    competitionScore: 58,
    monetizationScore: 91,
    opportunityScore: 85,
    growth30d: 27.5,
    growth90d: 58.9,
    searchVolumeEstimate: 5200,
    cluster: {
      slug: "compliance-automation",
      canonicalKeyword: "compliance automation",
      summary: "Automation for security reviews, questionnaires, and certification workflows.",
    },
    variants: [
      { variant: "SOC2 agent", normalized: "soc2 agent", sourcePlatform: SourcePlatform.REDDIT },
      { variant: "ai compliance agent", normalized: "ai compliance agent", sourcePlatform: SourcePlatform.GOOGLE_TRENDS },
      { variant: "vendor security questionnaire automation", normalized: "vendor security questionnaire automation", sourcePlatform: SourcePlatform.PRODUCT_HUNT },
      { variant: "soc 2 automation ai", normalized: "soc 2 automation ai", sourcePlatform: SourcePlatform.GOOGLE_TRENDS },
    ],
    metrics: metrics([
      { daysAgo: 28, opportunityScore: 67, trendScore: 70, demandScore: 71, competitionScore: 54, monetizationScore: 84, growthRate: 14.7, searchVolume: 3200, validationCount: 22 },
      { daysAgo: 21, opportunityScore: 73, trendScore: 75, demandScore: 74, competitionScore: 55, monetizationScore: 86, growthRate: 18.1, searchVolume: 3800, validationCount: 27 },
      { daysAgo: 14, opportunityScore: 79, trendScore: 80, demandScore: 77, competitionScore: 56, monetizationScore: 88, growthRate: 22.8, searchVolume: 4400, validationCount: 31 },
      { daysAgo: 7, opportunityScore: 82, trendScore: 83, demandScore: 78, competitionScore: 57, monetizationScore: 90, growthRate: 25.1, searchVolume: 4900, validationCount: 34 },
      { daysAgo: 0, opportunityScore: 85, trendScore: 86, demandScore: 80, competitionScore: 58, monetizationScore: 91, growthRate: 27.5, searchVolume: 5200, validationCount: 36 },
    ]),
    recommendation: {
      recommendedProductType: ProductType.SAAS,
      headline: "Build a compliance co-pilot that handles evidence collection and questionnaires.",
      targetUsers: ["Security leads", "Compliance managers", "B2B SaaS founders"],
      mvpFeatures: ["Policy inventory", "Evidence collection workflow", "Questionnaire autofill drafts", "Control owner reminders"],
      monetizationModel: ["Annual compliance plan", "Managed onboarding fee", "Premium vendor questionnaire credits"],
      risks: ["High expectations around trust", "Need integrations with security tools", "Sales cycles can be longer"],
      differentiation: "Target startups before their first audit with lightweight workflows and AI-assisted questionnaire completion.",
    },
  },
  {
    slug: "micro-learning-ai",
    canonicalKeyword: "micro learning ai",
    category: KeywordCategory.HEALTH,
    intent: KeywordIntent.INFORMATIONAL,
    trendType: TrendType.STEADY_GROWTH,
    competitionLevel: CompetitionLevel.LOW,
    recommendedProductType: ProductType.MOBILE_APP,
    region: "US",
    description: "Consumers and teams want bite-sized learning flows generated from interests or skill gaps.",
    validationCount: 20,
    sourceCount: 2,
    longTailCount: 9,
    variantCount: 3,
    trendScore: 71,
    demandScore: 66,
    competitionScore: 31,
    monetizationScore: 61,
    opportunityScore: 74,
    growth30d: 17.2,
    growth90d: 35.4,
    searchVolumeEstimate: 4300,
    cluster: {
      slug: "adaptive-learning",
      canonicalKeyword: "adaptive learning",
      summary: "Personalized learning and knowledge retention products.",
    },
    variants: [
      { variant: "micro learning ai", normalized: "micro learning ai", sourcePlatform: SourcePlatform.GOOGLE_TRENDS },
      { variant: "ai learning bites", normalized: "ai learning bites", sourcePlatform: SourcePlatform.REDDIT },
      { variant: "personalized micro courses", normalized: "personalized micro courses", sourcePlatform: SourcePlatform.PRODUCT_HUNT },
    ],
    metrics: metrics([
      { daysAgo: 28, opportunityScore: 58, trendScore: 60, demandScore: 57, competitionScore: 29, monetizationScore: 54, growthRate: 9.1, searchVolume: 2600, validationCount: 12 },
      { daysAgo: 21, opportunityScore: 63, trendScore: 63, demandScore: 60, competitionScore: 30, monetizationScore: 57, growthRate: 11.6, searchVolume: 3100, validationCount: 14 },
      { daysAgo: 14, opportunityScore: 68, trendScore: 67, demandScore: 63, competitionScore: 30, monetizationScore: 58, growthRate: 14.4, searchVolume: 3600, validationCount: 16 },
      { daysAgo: 7, opportunityScore: 71, trendScore: 69, demandScore: 65, competitionScore: 31, monetizationScore: 60, growthRate: 15.7, searchVolume: 4000, validationCount: 18 },
      { daysAgo: 0, opportunityScore: 74, trendScore: 71, demandScore: 66, competitionScore: 31, monetizationScore: 61, growthRate: 17.2, searchVolume: 4300, validationCount: 20 },
    ]),
    recommendation: {
      recommendedProductType: ProductType.MOBILE_APP,
      headline: "Launch a mobile-first habit learning app with AI-generated curricula.",
      targetUsers: ["Career switchers", "Managers training teams", "Lifelong learners"],
      mvpFeatures: ["Goal-based learning tracks", "Daily five-minute lessons", "Knowledge checks", "Progress streaks"],
      monetizationModel: ["Freemium subscription", "Team licenses", "Premium learning paths"],
      risks: ["Consumer retention pressure", "Requires strong content quality", "Needs clear learning outcomes"],
      differentiation: "Position around AI-curated lesson plans for busy professionals, not generic flashcards.",
    },
  }
] as const;

async function main() {
  const email = process.env.DEMO_USER_EMAIL ?? "founder@opportunityradar.dev";
  const password = process.env.DEMO_USER_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name: "Demo Founder" },
    create: { email, name: "Demo Founder", passwordHash },
  });

  for (const item of keywords) {
    const cluster = await prisma.keywordCluster.upsert({
      where: { slug: item.cluster.slug },
      update: {
        canonicalKeyword: item.cluster.canonicalKeyword,
        summary: item.cluster.summary,
      },
      create: item.cluster,
    });

    const keyword = await prisma.keyword.upsert({
      where: { slug: item.slug },
      update: {
        canonicalKeyword: item.canonicalKeyword,
        category: item.category,
        intent: item.intent,
        trendType: item.trendType,
        competitionLevel: item.competitionLevel,
        recommendedProductType: item.recommendedProductType,
        region: item.region,
        description: item.description,
        validationCount: item.validationCount,
        sourceCount: item.sourceCount,
        longTailCount: item.longTailCount,
        variantCount: item.variantCount,
        trendScore: new Prisma.Decimal(item.trendScore),
        demandScore: new Prisma.Decimal(item.demandScore),
        competitionScore: new Prisma.Decimal(item.competitionScore),
        monetizationScore: new Prisma.Decimal(item.monetizationScore),
        opportunityScore: new Prisma.Decimal(item.opportunityScore),
        growth30d: new Prisma.Decimal(item.growth30d),
        growth90d: new Prisma.Decimal(item.growth90d),
        searchVolumeEstimate: item.searchVolumeEstimate,
        clusterId: cluster.id,
      },
      create: {
        slug: item.slug,
        canonicalKeyword: item.canonicalKeyword,
        category: item.category,
        intent: item.intent,
        trendType: item.trendType,
        competitionLevel: item.competitionLevel,
        recommendedProductType: item.recommendedProductType,
        region: item.region,
        description: item.description,
        validationCount: item.validationCount,
        sourceCount: item.sourceCount,
        longTailCount: item.longTailCount,
        variantCount: item.variantCount,
        trendScore: new Prisma.Decimal(item.trendScore),
        demandScore: new Prisma.Decimal(item.demandScore),
        competitionScore: new Prisma.Decimal(item.competitionScore),
        monetizationScore: new Prisma.Decimal(item.monetizationScore),
        opportunityScore: new Prisma.Decimal(item.opportunityScore),
        growth30d: new Prisma.Decimal(item.growth30d),
        growth90d: new Prisma.Decimal(item.growth90d),
        searchVolumeEstimate: item.searchVolumeEstimate,
        clusterId: cluster.id,
      },
    });

    await prisma.keywordVariant.deleteMany({ where: { keywordId: keyword.id } });
    await prisma.keywordMetric.deleteMany({ where: { keywordId: keyword.id } });
    await prisma.keywordSourceEvent.deleteMany({ where: { keywordId: keyword.id } });

    await prisma.keywordVariant.createMany({
      data: item.variants.map((variant) => ({ keywordId: keyword.id, ...variant })),
    });

    await prisma.keywordMetric.createMany({
      data: item.metrics.map((entry) => ({
        keywordId: keyword.id,
        capturedAt: new Date(Date.now() - entry.daysAgo * 86400000),
        trendScore: new Prisma.Decimal(entry.trendScore),
        demandScore: new Prisma.Decimal(entry.demandScore),
        competitionScore: new Prisma.Decimal(entry.competitionScore),
        monetizationScore: new Prisma.Decimal(entry.monetizationScore),
        opportunityScore: new Prisma.Decimal(entry.opportunityScore),
        growthRate: new Prisma.Decimal(entry.growthRate),
        searchVolume: entry.searchVolume,
        validationCount: entry.validationCount,
      })),
    });

    const run = await prisma.ingestionRun.create({
      data: {
        sourcePlatform: SourcePlatform.GOOGLE_TRENDS,
        status: IngestionStatus.SUCCESS,
        startedAt: new Date(Date.now() - 3600000),
        finishedAt: new Date(),
        recordsCollected: item.variants.length,
        recordsAccepted: item.variants.length,
        metadata: { seeded: true },
      },
    });

    await prisma.keywordSourceEvent.createMany({
      data: item.variants.map((variant, index) => ({
        keywordId: keyword.id,
        sourcePlatform: variant.sourcePlatform,
        rawKeyword: variant.variant,
        rawScore: new Prisma.Decimal(item.trendScore - index * 4),
        region: item.region,
        collectedAt: new Date(Date.now() - index * 7200000),
        ingestionRunId: run.id,
        metadata: { seeded: true },
      })),
    });

    await prisma.productRecommendation.upsert({
      where: { keywordId: keyword.id },
      update: {
        recommendedProductType: item.recommendation.recommendedProductType,
        headline: item.recommendation.headline,
        targetUsers: item.recommendation.targetUsers,
        mvpFeatures: item.recommendation.mvpFeatures,
        monetizationModel: item.recommendation.monetizationModel,
        risks: item.recommendation.risks,
        differentiation: item.recommendation.differentiation,
      },
      create: {
        keywordId: keyword.id,
        ...item.recommendation,
      },
    });

    await prisma.savedKeyword.upsert({
      where: { userId_keywordId: { userId: user.id, keywordId: keyword.id } },
      update: {},
      create: { userId: user.id, keywordId: keyword.id },
    });
  }

  await prisma.alert.deleteMany({ where: { userId: user.id } });

  await prisma.alert.createMany({
    data: [
      {
        userId: user.id,
        title: "Breakout opportunity detected",
        message: "UGC ads library crossed an 80 opportunity score with low competition.",
        severity: AlertSeverity.INFO,
      },
      {
        userId: user.id,
        title: "Competition increasing",
        message: "AI meeting notes is trending strongly, but competition moved into medium territory.",
        severity: AlertSeverity.WARNING,
      },
      {
        userId: user.id,
        title: "High monetization signal",
        message: "SOC2 agent shows unusually strong willingness-to-pay signals across enterprise discussions.",
        severity: AlertSeverity.CRITICAL,
      },
    ],
  });

  console.log(`Seeded Opportunity Radar demo user: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
