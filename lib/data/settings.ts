import { prisma } from "@/lib/db";

export async function getSettingsData(userId: string) {
  const [user, savedKeywords, ingestionRuns] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.savedKeyword.findMany({ where: { userId }, include: { keyword: true }, take: 5 }),
    prisma.ingestionRun.findMany({ orderBy: { startedAt: "desc" }, take: 5 }),
  ]);

  return { user, savedKeywords, ingestionRuns };
}
