import { Download } from "lucide-react";
import { Button } from "../../ui/Button";
import { useInventory } from "../../../hooks/useInventory";

export function DataTab() {
  const { inventory } = useInventory();

  const handleExport = () => {
    // Use human-readable headers instead of raw database column names
    const headers = [
      "Product Name",
      "Category",
      "Unit Price",
      "Current Stock",
      "Minimum Stock Level",
    ];
    
    const rows = inventory.map(
      (item) =>
        `"${item.name}","${item.category}",${item.price},${item.quantity},${item.minStock}`,
    );
    
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900">
          Data Management
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Export your inventory data
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Download className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Export Inventory Data</p>
              <p className="text-sm text-gray-500">
                Download a clean report of all your inventory as a CSV file
              </p>
            </div>
          </div>
          <Button variant="secondary" className="py-2" onClick={handleExport}>
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
