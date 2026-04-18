import { TrendingUp } from "lucide-react";
import type { Inventory, RestockEntry } from "../../types";
import { RestockTrendChart } from "./analytics/RestockTrendChart";
import { CategoryDistribution } from "./analytics/CategoryDistribution";
import { RestockIntelligence } from "./analytics/RestockIntelligence";

interface SmartAnalyticsProps {
  inventory: Inventory[];
  history: RestockEntry[];
  loading: boolean;
}

export function SmartAnalytics({
  inventory,
  history,
  loading,
}: SmartAnalyticsProps) {
  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <div className="bg-emerald-50 rounded-lg p-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Smart Analytics
          </h2>
          <p className="text-xs text-gray-500">
            Inventory trends and restocking intelligence
          </p>
        </div>
      </div>

      {/* Row 1: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RestockTrendChart history={history} loading={loading} />
        <CategoryDistribution inventory={inventory} loading={loading} />
      </div>

      {/* Row 2: Intelligence */}
      <RestockIntelligence
        inventory={inventory}
        history={history}
        loading={loading}
      />
    </div>
  );
}
