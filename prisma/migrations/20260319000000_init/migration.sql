-- Initial Opportunity Radar schema.
CREATE TYPE "KeywordCategory" AS ENUM ('AI', 'PRODUCTIVITY', 'FINTECH', 'HEALTH', 'ECOMMERCE', 'MARKETING', 'DEVELOPER_TOOLS', 'ANALYTICS', 'COMMUNITY', 'OTHER');
CREATE TYPE "KeywordIntent" AS ENUM ('INFORMATIONAL', 'TRANSACTIONAL', 'NAVIGATIONAL', 'COMMERCIAL', 'PROBLEM_AWARE');
CREATE TYPE "TrendType" AS ENUM ('BREAKOUT', 'STEADY_GROWTH', 'SEASONAL', 'SPIKE', 'STABLE');
CREATE TYPE "SourcePlatform" AS ENUM ('GOOGLE_TRENDS', 'REDDIT', 'PRODUCT_HUNT', 'HACKER_NEWS', 'MANUAL');
CREATE TYPE "CompetitionLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE "ProductType" AS ENUM ('SAAS', 'MARKETPLACE', 'MEDIA_SITE', 'API', 'MOBILE_APP', 'BROWSER_EXTENSION', 'COMMUNITY');
CREATE TYPE "IngestionStatus" AS ENUM ('SUCCESS', 'PARTIAL', 'FAILED');
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" TIMESTAMP(3),
  "image" TEXT,
  "passwordHash" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Account" (
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("provider", "providerAccountId")
);

CREATE TABLE "Session" (
  "sessionToken" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  PRIMARY KEY ("identifier", "token")
);

CREATE TABLE "KeywordCluster" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "canonicalKeyword" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Keyword" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "canonicalKeyword" TEXT NOT NULL UNIQUE,
  "category" "KeywordCategory" NOT NULL,
  "intent" "KeywordIntent" NOT NULL,
  "trendType" "TrendType" NOT NULL,
  "competitionLevel" "CompetitionLevel" NOT NULL,
  "recommendedProductType" "ProductType" NOT NULL,
  "region" TEXT NOT NULL,
  "language" TEXT NOT NULL DEFAULT 'en',
  "description" TEXT NOT NULL,
  "validationCount" INTEGER NOT NULL DEFAULT 0,
  "sourceCount" INTEGER NOT NULL DEFAULT 0,
  "longTailCount" INTEGER NOT NULL DEFAULT 0,
  "variantCount" INTEGER NOT NULL DEFAULT 0,
  "trendScore" DECIMAL(5,2) NOT NULL,
  "demandScore" DECIMAL(5,2) NOT NULL,
  "competitionScore" DECIMAL(5,2) NOT NULL,
  "monetizationScore" DECIMAL(5,2) NOT NULL,
  "opportunityScore" DECIMAL(5,2) NOT NULL,
  "growth30d" DECIMAL(6,2) NOT NULL,
  "growth90d" DECIMAL(6,2) NOT NULL,
  "searchVolumeEstimate" INTEGER NOT NULL,
  "clusterId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "KeywordVariant" (
  "id" TEXT PRIMARY KEY,
  "keywordId" TEXT NOT NULL,
  "variant" TEXT NOT NULL,
  "normalized" TEXT NOT NULL,
  "sourcePlatform" "SourcePlatform" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("keywordId", "normalized")
);

CREATE TABLE "KeywordMetric" (
  "id" TEXT PRIMARY KEY,
  "keywordId" TEXT NOT NULL,
  "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "trendScore" DECIMAL(5,2) NOT NULL,
  "demandScore" DECIMAL(5,2) NOT NULL,
  "competitionScore" DECIMAL(5,2) NOT NULL,
  "monetizationScore" DECIMAL(5,2) NOT NULL,
  "opportunityScore" DECIMAL(5,2) NOT NULL,
  "growthRate" DECIMAL(6,2) NOT NULL,
  "searchVolume" INTEGER NOT NULL,
  "validationCount" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "KeywordSourceEvent" (
  "id" TEXT PRIMARY KEY,
  "keywordId" TEXT NOT NULL,
  "sourcePlatform" "SourcePlatform" NOT NULL,
  "rawKeyword" TEXT NOT NULL,
  "rawScore" DECIMAL(8,2) NOT NULL,
  "region" TEXT NOT NULL,
  "language" TEXT NOT NULL DEFAULT 'en',
  "collectedAt" TIMESTAMP(3) NOT NULL,
  "metadata" JSONB,
  "ingestionRunId" TEXT
);

CREATE TABLE "ProductRecommendation" (
  "id" TEXT PRIMARY KEY,
  "keywordId" TEXT NOT NULL UNIQUE,
  "recommendedProductType" "ProductType" NOT NULL,
  "headline" TEXT NOT NULL,
  "targetUsers" TEXT[] NOT NULL,
  "mvpFeatures" TEXT[] NOT NULL,
  "monetizationModel" TEXT[] NOT NULL,
  "risks" TEXT[] NOT NULL,
  "differentiation" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Alert" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "keywordId" TEXT,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "severity" "AlertSeverity" NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SavedKeyword" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "keywordId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("userId", "keywordId")
);

CREATE TABLE "IngestionRun" (
  "id" TEXT PRIMARY KEY,
  "sourcePlatform" "SourcePlatform" NOT NULL,
  "status" "IngestionStatus" NOT NULL,
  "startedAt" TIMESTAMP(3) NOT NULL,
  "finishedAt" TIMESTAMP(3),
  "recordsCollected" INTEGER NOT NULL DEFAULT 0,
  "recordsAccepted" INTEGER NOT NULL DEFAULT 0,
  "errorMessage" TEXT,
  "metadata" JSONB
);

CREATE INDEX "Keyword_category_intent_competitionLevel_recommendedProductType_idx" ON "Keyword"("category", "intent", "competitionLevel", "recommendedProductType");
CREATE INDEX "Keyword_opportunityScore_idx" ON "Keyword"("opportunityScore" DESC);
CREATE INDEX "KeywordMetric_keywordId_capturedAt_idx" ON "KeywordMetric"("keywordId", "capturedAt");
CREATE INDEX "KeywordSourceEvent_sourcePlatform_collectedAt_idx" ON "KeywordSourceEvent"("sourcePlatform", "collectedAt");
CREATE INDEX "IngestionRun_sourcePlatform_startedAt_idx" ON "IngestionRun"("sourcePlatform", "startedAt");

ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Keyword" ADD CONSTRAINT "Keyword_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "KeywordCluster"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "KeywordVariant" ADD CONSTRAINT "KeywordVariant_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "KeywordMetric" ADD CONSTRAINT "KeywordMetric_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "KeywordSourceEvent" ADD CONSTRAINT "KeywordSourceEvent_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "KeywordSourceEvent" ADD CONSTRAINT "KeywordSourceEvent_ingestionRunId_fkey" FOREIGN KEY ("ingestionRunId") REFERENCES "IngestionRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ProductRecommendation" ADD CONSTRAINT "ProductRecommendation_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SavedKeyword" ADD CONSTRAINT "SavedKeyword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SavedKeyword" ADD CONSTRAINT "SavedKeyword_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;
