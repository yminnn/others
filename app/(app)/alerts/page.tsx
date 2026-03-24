import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { formatDistanceToNow } from "date-fns";

export default async function AlertsPage() {
  const session = await auth();
  const alerts = await prisma.alert.findMany({ where: { userId: session!.user.id }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Alerts" title="Alerts and reports" description="Review notable opportunity changes, risk signals, and high-conviction findings across your monitored keyword portfolio." />
      <div className="grid gap-4 xl:grid-cols-2">
        {alerts.map((alert) => (
          <Card key={alert.id}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
              <Badge tone={alert.severity === "INFO" ? "default" : alert.severity === "WARNING" ? "warning" : "danger"}>{alert.severity}</Badge>
            </div>
            <p className="mt-3 text-sm text-slate-400">{alert.message}</p>
            <p className="mt-4 text-xs text-slate-500">{formatDistanceToNow(alert.createdAt, { addSuffix: true })}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
