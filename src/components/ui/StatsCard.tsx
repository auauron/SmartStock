import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  loading?: boolean;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = "bg-emerald-100",
  iconColor = "text-emerald-700",
  loading = false,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-2" />
          ) : (
            <p className="text-3xl font-semibold text-gray-900 mb-2">{value}</p>
          )}
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className={`${iconBgColor} rounded-lg p-3`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

