import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { RestockEntry } from "../../../types";

interface RestockTrendChartProps {
  history: RestockEntry[];
  loading: boolean;
}

interface DayData {
  date: string;
  label: string;
  quantity: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-bold text-gray-900">
        {payload[0].value} units
      </p>
    </div>
  );
}

export function RestockTrendChart({ history, loading }: RestockTrendChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    const days: DayData[] = [];

    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const label = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      days.push({ date: dateStr, label, quantity: 0 });
    }

    for (const entry of history) {
      const d = new Date(entry.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const entryDate = `${year}-${month}-${day}`;
      const match = days.find((d) => d.date === entryDate);
      if (match) {
        match.quantity += entry.quantityAdded;
      }
    }

    return days;
  }, [history]);

  const totalRestocked = useMemo(
    () => chartData.reduce((sum, d) => sum + d.quantity, 0),
    [chartData]
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-56 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
        <div className="p-6">
          <div className="h-64 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Restock Activity
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Units restocked per day (14-day window)
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded">
          {totalRestocked} total
        </span>
      </div>

      <div className="p-6">
        {history.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 text-sm text-center">
              Start restocking items to see trend data
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={256}>
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="restockGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3f4f6"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="quantity"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#restockGradient)"
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
