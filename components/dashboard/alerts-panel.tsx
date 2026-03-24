import { formatDistanceToNow } from "date-fns";
import type { Alert } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AlertsPanel({ alerts }: { alerts: Alert[] }) {
  return (
    <Card>
      <div>
        <h3 className="text-lg font-semibold text-white">Alerts</h3>
        <p className="mt-1 text-sm text-slate-400">Signal changes and noteworthy opportunities from your tracked portfolio.</p>
      </div>
      <div className="mt-6 space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-white">{alert.title}</p>
              <Badge tone={alert.severity === "INFO" ? "default" : alert.severity === "WARNING" ? "warning" : "danger"}>{alert.severity}</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-400">{alert.message}</p>
            <p className="mt-3 text-xs text-slate-500">{formatDistanceToNow(alert.createdAt, { addSuffix: true })}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
