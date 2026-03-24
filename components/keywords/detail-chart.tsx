"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";

export function DetailChart({ data }: { data: Array<{ date: string; opportunityScore: number; searchVolume: number }> }) {
  return (
    <Card className="h-[340px]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Momentum history</h3>
        <p className="text-sm text-slate-400">Opportunity score trend paired with estimated search volume.</p>
      </div>
      <ResponsiveContainer width="100%" height="82%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="scoreFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
          <XAxis dataKey="date" axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" axisLine={false} tickLine={false} domain={[0, 100]} />
          <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: 12, borderColor: "rgba(148,163,184,.16)" }} />
          <Area yAxisId="left" type="monotone" dataKey="opportunityScore" stroke="#38bdf8" fill="url(#scoreFill)" strokeWidth={3} />
          <Area yAxisId="right" type="monotone" dataKey="searchVolume" stroke="#22c55e" fill="rgba(34,197,94,0.08)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
