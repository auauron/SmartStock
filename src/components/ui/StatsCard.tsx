import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  loading?: boolean;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down" | "neutral";
  };
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = "bg-emerald-100",
  iconColor = "text-emerald-700",
  loading = false,
  trend,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          {loading ? (
            <div className="h-9 w-24 bg-gray-200 rounded animate-pulse mb-2" />
          ) : (
            <p className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{value}</p>
          )}
          
          <div className="flex flex-col gap-1">
            {trend && !loading && (
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    trend.direction === "up"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : trend.direction === "down"
                      ? "bg-red-50 text-red-700 border border-red-100"
                      : "bg-gray-50 text-gray-600 border border-gray-100"
                  }`}
                >
                  {trend.direction === "up" && <TrendingUp className="w-3 h-3" />}
                  {trend.direction === "down" && <TrendingDown className="w-3 h-3" />}
                  {trend.direction === "neutral" && <Minus className="w-3 h-3" />}
                  {trend.value}%
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {trend.label}
                </span>
              </div>
            )}
            <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
          </div>
        </div>
        <div className={`${iconBgColor} rounded-xl p-3 transform transition-transform group-hover:scale-110 duration-200`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

