import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import type { Inventory } from "../../types";
import { Modal } from "../ui/Modal";
import { InputField } from "../ui/InputField";
import { DropdownField } from "../ui/DropdownField";

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Inventory, "id"> & { id: string }) => Promise<void>;
  item?: Inventory;
  existingCategories: string[];
}

export function InventoryModal({
  isOpen,
  onClose,
  onSave,
  item,
  existingCategories = [],
}: ProductModalProps) {
  const [formData, setFormData] = useState<Omit<Inventory, "id">>({
    name: item?.name || "",
    category: item?.category || "",
    price: item?.price || 0,
    quantity: item?.quantity || 0,
    minStock: item?.minStock || 0,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: item?.name || "",
        category: item?.category || "",
        price: item?.price || 0,
        quantity: item?.quantity || 0,
        minStock: item?.minStock || 0,
      });
      setIsCustomCategory(false);
    }
  }, [item, isOpen]);

  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        id: item?.id || "",
        ...formData,
        name: capitalizeWords(formData.name.trim()),
        category: capitalizeWords(formData.category.trim()),
        price: isNaN(formData.price) ? 0 : formData.price,
        quantity: isNaN(formData.quantity) ? 0 : formData.quantity,
        minStock: isNaN(formData.minStock) ? 0 : formData.minStock,
      });
      setIsCustomCategory(false);
      onClose();
    } catch (err) {
      console.error("Failed to save item:", err);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? "Edit Item" : "Add New Item"}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <InputField
          id="inventory-item-name"
          type="text"
          required
          label="Item Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="py-2"
          placeholder="Enter item name"
        />

        {!isCustomCategory ? (
          <DropdownField
            id="inventory-category"
            required
            searchable
            stickyOptionValue="OTHER"
            label="Category"
            value={formData.category}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "OTHER") {
                setIsCustomCategory(true);
                setFormData({ ...formData, category: "" });
              } else {
                setFormData({ ...formData, category: val });
              }
            }}
            className="py-2"
          >
            <option value="">Select a category</option>
            {existingCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="OTHER" className="font-bold text-emerald-600">
              + Add New Category
            </option>
          </DropdownField>
        ) : (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
            <InputField
              id="inventory-new-category"
              type="text"
              required
              label="New Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder="e.g. Accessories"
              className="py-2"
            />
            <button
              type="button"
              onClick={() => {
                setIsCustomCategory(false);
                setFormData({ ...formData, category: "" });
              }}
              className="text-xs text-emerald-600 hover:text-emerald-700 underline"
            >
              Back to existing categories
            </button>
          </div>
        )}

        <InputField
          id="inventory-price"
          type="number"
          required
          min={0}
          step="0.01"
          label="Price"
          startAdornment={<span>₱</span>}
          value={isNaN(formData.price) ? "" : formData.price}
          onFocus={(e) => e.target.select()}
          onChange={(e) =>
            setFormData({ ...formData, price: parseFloat(e.target.value) })
          }
          className="py-2 pl-8"
          placeholder="0.00"
        />
        <InputField
          id="inventory-quantity"
          type="number"
          required
          min={0}
          label="Quantity"
          value={isNaN(formData.quantity) ? "" : formData.quantity}
          onFocus={(e) => e.target.select()}
          onChange={(e) =>
            setFormData({ ...formData, quantity: parseInt(e.target.value, 10) })
          }
          className="py-2"
          placeholder="0"
        />
        <InputField
          id="inventory-min-stock"
          type="number"
          required
          min={0}
          label="Minimum Stock Level"
          value={isNaN(formData.minStock) ? "" : formData.minStock}
          onFocus={(e) => e.target.select()}
          onChange={(e) =>
            setFormData({ ...formData, minStock: parseInt(e.target.value, 10) })
          }
          className="py-2"
          placeholder="0"
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : item ? "Update Item" : "Save Item"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
