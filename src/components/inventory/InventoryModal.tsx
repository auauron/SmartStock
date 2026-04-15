import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import type { Inventory } from "../../types"
import { Modal } from "../ui/Modal";
import { InputField } from "../ui/InputField";
import { DropdownField } from "../ui/DropdownField";

interface InventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: Omit<Inventory, "id"> & { id: string }) => Promise<void>;
    item?: Inventory;
    existingCategories: string[];
}

export function InventoryModal ({ 
    isOpen,
    onClose,
    onSave,
    item,
    existingCategories
}: InventoryModalProps) {
    const [formData, setFormData] = useState<Omit<Inventory, "id">>(() => ({
        name: item?.name || "",
        category: item?.category || "",
        price: item?.price || 0,
        quantity: item?.quantity || 0,
        minStock: item?.minStock || 0,
    }));

    const [isCustomCategory, setIsCustomCategory] = useState(false);

    useEffect(() => {
        setFormData({
            name: item?.name || "",
            category: item?.category || "",
            price: item?.price || 0,
            quantity: item?.quantity || 0,
            minStock: item?.minStock || 0,
        });
        
        // Reset custom category flag. If item has a category that's NOT in the list (unlikely but possible), 
        // we could set it to true, but usually it's false on load.
        setIsCustomCategory(false);
    }, [item]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await onSave({
                id: item?.id || "",
                ...formData,
                price: isNaN(formData.price) ? 0 : formData.price,
                quantity: isNaN(formData.quantity) ? 0 : formData.quantity,
                minStock: isNaN(formData.minStock) ? 0 : formData.minStock,
            });
            onClose();
        } catch (err) {
            console.error("Failed to save inventory item:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={ item ? "Edit Item" : "Add New Item"}
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <InputField
                type="text"
                required
                label="Item Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="py-2"
                placeholder="Enter item name"
              />
              <DropdownField
                required
                label="Category"
                value={isCustomCategory ? "OTHER" : formData.category}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "OTHER") {
                    setIsCustomCategory(true);
                    setFormData({ ...formData, category: "" });
                  } else {
                    setIsCustomCategory(false);
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
                <option value="OTHER">+ Add New Category</option>
              </DropdownField>

              {isCustomCategory && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                  <InputField
                    type="text"
                    required
                    label="New Category Name"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g. Hardware"
                    className="py-2"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(false)}
                    className="text-xs text-emerald-600 hover:text-emerald-700 underline"
                  >
                    Back to List
                  </button>
                </div>
              )}

              <InputField
                type="number"
                required
                min={0}
                step="0.01"
                label="Price"
                startAdornment={<span>₱</span>}
                value={isNaN(formData.price) ? "" : formData.price}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                className="py-2 pl-8"
                placeholder="0.00"
                />
              <InputField
                type="number"
                required
                min={0}
                label="Current Quantity"
                value={isNaN(formData.quantity) ? "" : formData.quantity}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) })}
                className="py-2"
                placeholder="0"
                />
                <InputField
                type="number"
                required
                min={0}
                label="Minimum Stock Level"
                value={isNaN(formData.minStock) ? "" : formData.minStock}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value, 10) })}
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
                  <Button
                  type="submit"
                  className="flex-1"
                  >
                    Save Item
                  </Button>
                </div>
            </form>
        </Modal>
    );
}