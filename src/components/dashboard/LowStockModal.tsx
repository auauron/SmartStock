import { Modal } from "../ui/Modal";
import type { Inventory } from "../../types";

interface LowStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Inventory[];
}

export function LowStockModal({ isOpen, onClose, items }: LowStockModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="All Low Stock Items"
    >
      <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-4">All stock levels are healthy! 🎉</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-yellow-700">
                    {item.quantity} / {item.minStock}
                  </p>
                  <p className="text-xs text-gray-400">current / min</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
