"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

  const ref = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    if (width > 0 && height > 0) {
      setDims((prev) =>
        prev.width === Math.round(width) && prev.height === Math.round(height)
          ? prev
          : { width: Math.round(width), height: Math.round(height) },
      );
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div ref={ref} className="h-64 w-full">
      {dims.width > 0 && dims.height > 0 && (
        <BarChart width={dims.width} height={dims.height} data={rows} margin={{ top: 12, right: 8, left: -12, bottom: 4 }}>
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
      )}
    </div>
  );
}
