"use client";

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import type { TrendPoint } from "@/lib/types";
import { Card } from "@/components/ui/card";

export function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <Card className="h-[360px]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Trend momentum</h3>
        <p className="text-sm text-slate-400">Average opportunity and trend scores across the last 30 days.</p>
      </div>
      <ResponsiveContainer width="100%" height="82%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
          <XAxis dataKey="date" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: 12, borderColor: "rgba(148,163,184,.16)" }} />
          <Legend />
          <Line type="monotone" dataKey="opportunityScore" stroke="#38bdf8" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="trendScore" stroke="#22c55e" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
