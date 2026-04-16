"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MOODS } from "@/lib/constants/moods";

export type MoodCount = { mood: string; label: string; count: number; color: string };

export function WeeklyMoodChart({ data }: { data: MoodCount[] }) {
  const byValue = Object.fromEntries(MOODS.map((m) => [m.value, m]));
  const rows = data.map((d) => ({
    ...d,
    color: byValue[d.mood]?.chart ?? "#999",
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 12, right: 8, left: -12, bottom: 4 }}>
          <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "currentColor" }}
            tickLine={false}
            axisLine={false}
            interval={0}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "currentColor" }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.08)",
              fontSize: 13,
            }}
            formatter={(value) => [`${value}`, "entries"]}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {rows.map((r) => (
              <Cell key={r.mood} fill={r.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
