import { NextResponse } from "next/server";
import { IngestionStatus, SourcePlatform } from "@prisma/client";
import { prisma } from "@/lib/db";
import { buildIngestionRunMetadata, runIngestionPipeline } from "@/lib/services/ingestion";

export async function POST() {
  const startedAt = new Date();
  const results = await runIngestionPipeline();

  const run = await prisma.ingestionRun.create({
    data: {
      sourcePlatform: SourcePlatform.MANUAL,
      status: IngestionStatus.SUCCESS,
      startedAt,
      finishedAt: new Date(),
      recordsCollected: results.length,
      recordsAccepted: results.length,
      metadata: buildIngestionRunMetadata(results.length),
    },
  });

  return NextResponse.json({
    runId: run.id,
    results,
  });
}
