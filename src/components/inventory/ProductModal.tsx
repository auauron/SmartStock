import { useState } from "react";
import { Button } from "../ui/Button";
import type { Product } from "../../types"
import { Modal } from "../ui/Modal";
import { InputField } from "../ui/InputField";
import { DropdownField } from "../ui/DropdownField";



interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Omit<Product, "id"> & { id: string }) => void;
    product?: Product;
    existingCategories: string[];
}

export function ProductModal ({ 
    isOpen,
    onClose,
    onSave,
    product,
    existingCategories = []
}: ProductModalProps) {
    const [formData, setFormData] = useState<Omit<Product, "id">>(() => ({
        name: product?.name || "",
        category: product?.category || "",
        price: product?.price || 0,
        quantity: product?.quantity || 0,
        minStock: product?.minStock || 0,
    }));
    const [isCustomCategory, setIsCustomCategory] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await onSave({
                id: product?.id || "",
                ...formData,
                price: isNaN(formData.price) ? 0 : formData.price,
                quantity: isNaN(formData.quantity) ? 0 : formData.quantity,
                minStock: isNaN(formData.minStock) ? 0 : formData.minStock,
            });
            setIsCustomCategory(false);
            onClose();
        } catch (err) {
            console.error("Failed to save product:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={ product ? "Edit Product" : "Add New Product"}
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <InputField
                type="text"
                required
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="py-2"
                placeholder="Enter product name"
              />

              {!isCustomCategory ? (
                <DropdownField
                required
                label="Category"
                value={formData.category}
                onChange={(e) => {
                  const val = e.target.value
                  if (val === "OTHER") {
                  setIsCustomCategory(true);
                  setFormData({ ...formData, category: ""})
                  } else {
                    setFormData({ ...formData, category: val});
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
                    setFormData({...formData, category: ""});
                  }}
                  className="text-xs text-emerald-600 hover:text-emerald-700 underline"
                  >
                    Back to existing categories
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
                label="Quantity"
                value={isNaN(formData.quantity) ? "" : formData.quantity}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) || 0 })}
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
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value, 10) || 0 })}
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
                    {product ? "Update Product" : "Save Product"}
                  </Button>
                </div>
            </form>
        </Modal>
    );
}