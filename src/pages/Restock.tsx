import { useState } from "react";
import { Plus } from "lucide-react";

interface RestockEntry {
  id: string;
  productName: string;
  quantityAdded: number;
  date: string;
  notes: string;
}

const initialHistory: RestockEntry[] = [
  {
    id: "1",
    productName: "Laptop Stand",
    quantityAdded: 50,
    date: "2026-03-10",
    notes: "Regular monthly restock",
  },
  {
    id: "2",
    productName: "Mechanical Keyboard",
    quantityAdded: 100,
    date: "2026-03-10",
    notes: "New product launch",
  },
  {
    id: "3",
    productName: "Monitor 24\"",
    quantityAdded: 25,
    date: "2026-03-09",
    notes: "Low stock replenishment",
  },
  {
    id: "4",
    productName: "Wireless Mouse",
    quantityAdded: 75,
    date: "2026-03-08",
    notes: "Emergency restock due to high demand",
  },
  {
    id: "5",
    productName: "USB Cable",
    quantityAdded: 200,
    date: "2026-03-07",
    notes: "Bulk order from supplier",
  },
];

export function Restock() {
  const [history, setHistory] = useState<RestockEntry[]>(initialHistory);
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: RestockEntry = {
      id: Date.now().toString(),
      productName: formData.productName,
      quantityAdded: parseInt(formData.quantity),
      date: new Date().toISOString().split("T")[0],
      notes: formData.notes,
    };
    setHistory([newEntry, ...history]);
    setFormData({ productName: "", quantity: "", notes: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Restock Management</h1>
        <p className="text-gray-600 mt-1">Add new stock and track restock history</p>
      </div>

      {/* Restock Form */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Restock</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Name
              </label>
              <select
                required
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select a product</option>
                <option value="Wireless Mouse">Wireless Mouse</option>
                <option value="Office Chair">Office Chair</option>
                <option value="USB Cable">USB Cable</option>
                <option value="Laptop Stand">Laptop Stand</option>
                <option value="Mechanical Keyboard">Mechanical Keyboard</option>
                <option value="Notebook">Notebook</option>
                <option value="Monitor 24&quot;">Monitor 24"</option>
                <option value="Desk Lamp">Desk Lamp</option>
                <option value="Webcam HD">Webcam HD</option>
                <option value="Pen Set">Pen Set</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Restock Quantity
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter quantity"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              placeholder="Add any notes about this restock..."
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Restock Entry
          </button>
        </form>
      </div>

      {/* Restock History */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Restock History</h2>
          <p className="text-sm text-gray-600 mt-1">Recent restocking activities</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
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
              {history.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{entry.productName}</span>
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
                  <td className="px-6 py-4 text-gray-600">
                    {entry.notes || (
                      <span className="text-gray-400 italic">No notes</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {history.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No restock history available</p>
          </div>
        )}
      </div>
    </div>
  );
}
