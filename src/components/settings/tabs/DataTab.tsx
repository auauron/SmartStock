import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "../../ui/Button";
import { useInventory } from "../../../hooks/useInventory";

export function DataTab() {
  const { inventory } = useInventory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingImport, setLoadingImport] = useState(false);

  const handleExport = () => {
    const headers = [
      "id",
      "name",
      "category",
      "price",
      "quantity",
      "minStock",
    ];
    const rows = inventory.map(
      (item) =>
        `${item.id},"${item.name}","${item.category}",${item.price},${item.quantity},${item.minStock}`,
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

  const handleImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadingImport(true);
    // basic mock for import as per instructions
    setTimeout(() => {
      alert(`Imported ${file.name} successfully! Check inventory for updates.`);
      setLoadingImport(false);
      // clear input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900">
          Data Management
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Export or import your inventory data
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Download className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Export Data</p>
              <p className="text-sm text-gray-500">
                Download all your inventory data as CSV
              </p>
            </div>
          </div>
          <Button variant="secondary" className="py-2" onClick={handleExport}>
            Export
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Import Data</p>
              <p className="text-sm text-gray-500">
                Import inventory data from CSV file
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="py-2"
            disabled={loadingImport}
            onClick={() => fileInputRef.current?.click()}
          >
            {loadingImport ? "Importing..." : "Import"}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv"
            onChange={handleImportChange}
          />
        </div>
      </div>
    </div>
  );
}
