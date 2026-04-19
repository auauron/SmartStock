import { Calendar, Filter } from "lucide-react";
import { DropdownField } from "../ui/DropdownField";
import { Pagination } from "../ui/Pagination";
import type { RestockEntry, RestockInventoryOption } from "../../types";

interface RestockHistoryTableProps {
  loading: boolean;
  inventory: RestockInventoryOption[];
  dateFilter: string;
  inventoryFilter: string;
  onDateFilterChange: (value: string) => void;
  onInventoryFilterChange: (value: string) => void;
  rows: RestockEntry[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNoResults: boolean;
}

export function RestockHistoryTable({
  loading,
  inventory,
  dateFilter,
  inventoryFilter,
  onDateFilterChange,
  onInventoryFilterChange,
  rows,
  totalItems,
  currentPage,
  itemsPerPage,
  totalPages,
  onPageChange,
  hasNoResults,
}: RestockHistoryTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Restock History
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Recent restocking activities
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <DropdownField
            icon={Calendar}
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="py-1.5 text-sm"
            wrapperClassName="w-full sm:w-40"
          >
            <option value="" disabled>
              Date Range
            </option>
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </DropdownField>

          <DropdownField
            icon={Filter}
            value={inventoryFilter}
            onChange={(e) => onInventoryFilterChange(e.target.value)}
            className="py-1.5 text-sm"
            wrapperClassName="w-full sm:w-48"
          >
            <option value="">All Items</option>
            {inventory.map((item) => (
              <option key={`filter-${item.id}`} value={item.name}>
                {item.name}
              </option>
            ))}
          </DropdownField>
        </div>
      </div>

      {loading ? (
        <div
          className="flex items-center justify-center gap-3 py-12"
          role="status"
          aria-live="polite"
        >
          <span
            className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600"
            aria-hidden="true"
          />
          <p className="text-gray-500">Loading restock history...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity Added
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">
                      {entry.inventoryName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      +{entry.quantityAdded} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-normal wrap-break-word max-w-xs sm:max-w-sm md:max-w-md">
                    {entry.notes || (
                      <span className="text-gray-400 italic">No notes</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && totalItems > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm bg-gray-50/50">
          <span className="text-gray-500 font-medium">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
            transactions
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {!loading && hasNoResults && (
        <div className="text-center py-12">
          <p className="text-gray-500">No restock history available</p>
        </div>
      )}
    </div>
  );
}
