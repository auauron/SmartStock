import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Inventory } from "../../../types";

interface CategoryDistributionProps {
  inventory: Inventory[];
  loading: boolean;
}

interface CategoryData {
  name: string;
  displayName: string;
  itemCount: number;
  totalQuantity: number;
  totalValue: number;
}

const CATEGORY_GRADIENT_ID = "categoryDistributionGradient";
const MAX_VISIBLE_CATEGORIES = 5;

function shortenChartLabel(label: string) {
  return label.length > 11 ? `${label.slice(0, 8)}...` : label;
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
          <span className="text-gray-400">Full name:</span>{" "}
          <span className="font-medium text-gray-900">{d.name}</span>
        </p>
        <p>
          <span className="text-gray-400">Count:</span>{" "}
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
          displayName: shortenChartLabel(cat),
          itemCount: 1,
          totalQuantity: item.quantity,
          totalValue: item.price * item.quantity,
        });
      }
    }

    return Array.from(map.values()).sort(
      (a, b) => b.itemCount - a.itemCount
    );
  }, [inventory]);
  const visibleChartData = useMemo(() => {
    if (chartData.length <= MAX_VISIBLE_CATEGORIES) return chartData;

    const topCategories = chartData.slice(0, MAX_VISIBLE_CATEGORIES);
    const otherCategories = chartData.slice(MAX_VISIBLE_CATEGORIES);
    const others = otherCategories.reduce<CategoryData>(
      (total, item) => ({
        name: "Others",
        displayName: "Others",
        itemCount: total.itemCount + item.itemCount,
        totalQuantity: total.totalQuantity + item.totalQuantity,
        totalValue: total.totalValue + item.totalValue,
      }),
      {
        name: "Others",
        displayName: "Others",
        itemCount: 0,
        totalQuantity: 0,
        totalValue: 0,
      },
    );

    return [...topCategories, others];
  }, [chartData]);
  const chartHeight = 220;

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
            Top 5 categories by item count
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded">
          {chartData.length} total
        </span>
      </div>

      <div className="px-4 py-3">
        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 text-sm text-center">
              Add inventory items to see category breakdown
            </p>
          </div>
        ) : (
          <div className="overflow-hidden pb-2">
            <div>
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                  data={visibleChartData}
                  margin={{ top: 4, right: 14, left: -12, bottom: 0 }}
                  barCategoryGap={visibleChartData.length === 1 ? "52%" : "16%"}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f3f4f6"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="displayName"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                    interval={0}
                    height={28}
                    tickFormatter={(value: string) => value}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="itemCount"
                    fill={`url(#${CATEGORY_GRADIENT_ID})`}
                    maxBarSize={96}
                    radius={[6, 6, 0, 0]}
                    animationDuration={800}
                    animationBegin={300}
                  />
                  <defs>
                    <linearGradient
                      id={CATEGORY_GRADIENT_ID}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
              {chartData.length === 1 && (
                <p className="mt-2 text-center text-xs text-gray-500">
                  Add another category to compare stock distribution.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
