"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

export function RunIngestionButton() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <Button
        onClick={() => {
          startTransition(async () => {
            setMessage(null);
            setError(null);

            try {
              const response = await fetch("/api/ingest/mock", { method: "POST" });
              if (!response.ok) {
                throw new Error("Ingestion request failed.");
              }

              const data = (await response.json()) as { runId: string; results: unknown[] };
              setMessage(`Created ingestion run ${data.runId} with ${data.results.length} normalized signals.`);
            } catch (requestError) {
              setError(requestError instanceof Error ? requestError.message : "Unexpected ingestion error.");
            }
          });
        }}
        disabled={isPending}
      >
        {isPending ? "Running ingestion..." : "Run mock ingestion"}
      </Button>
      <p className="text-sm text-slate-400">Triggers the server-side ingestion API using the modular collector pipeline.</p>
      {message ? <p className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{message}</p> : null}
      {error ? <p className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p> : null}
    </div>
  );
}
