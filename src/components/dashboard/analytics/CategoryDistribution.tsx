import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Inventory } from "../../../types";

interface CategoryDistributionProps {
  inventory: Inventory[];
  loading: boolean;
}

interface CategoryData {
  name: string;
  itemCount: number;
  totalQuantity: number;
  totalValue: number;
}

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
];

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: CategoryData }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const formatted = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(d.totalValue);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 min-w-[140px]">
      <p className="text-xs font-semibold text-gray-900 mb-1">{d.name}</p>
      <div className="space-y-0.5 text-xs text-gray-600">
        <p>
          <span className="text-gray-400">Items:</span>{" "}
          <span className="font-medium text-gray-900">{d.itemCount}</span>
        </p>
        <p>
          <span className="text-gray-400">Stock:</span>{" "}
          <span className="font-medium text-gray-900">
            {d.totalQuantity} units
          </span>
        </p>
        <p>
          <span className="text-gray-400">Value:</span>{" "}
          <span className="font-medium text-gray-900">{formatted}</span>
        </p>
      </div>
    </div>
  );
}

export function CategoryDistribution({
  inventory,
  loading,
}: CategoryDistributionProps) {
  const chartData = useMemo(() => {
    const map = new Map<string, CategoryData>();

    for (const item of inventory) {
      const cat = item.category || "Uncategorized";
      const existing = map.get(cat);

      if (existing) {
        existing.itemCount++;
        existing.totalQuantity += item.quantity;
        existing.totalValue += item.price * item.quantity;
      } else {
        map.set(cat, {
          name: cat,
          itemCount: 1,
          totalQuantity: item.quantity,
          totalValue: item.price * item.quantity,
        });
      }
    }

    return Array.from(map.values()).sort(
      (a, b) => b.totalQuantity - a.totalQuantity
    );
  }, [inventory]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-5 w-44 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-52 bg-gray-200 rounded animate-pulse mt-2" />
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
            Category Distribution
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Inventory breakdown by category
          </p>
        </div>
        <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded">
          {chartData.length} categories
        </span>
      </div>

      <div className="p-6">
        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 text-sm text-center">
              Add inventory items to see category breakdown
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-hidden pb-2" style={{ scrollbarWidth: 'thin' }}>
            <div style={{ minWidth: `${Math.max(chartData.length * 80, 400)}px` }}>
              <ResponsiveContainer width="100%" height={256}>
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3f4f6"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
                interval={0}
                tickFormatter={(v: string) => truncate(v, 11)}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="totalQuantity"
                radius={[4, 4, 0, 0]}
                animationDuration={800}
                animationBegin={300}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )}
      </div>
    </div>
  );
}
