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
    product?: Product
}

export function ProductModal ({ 
    isOpen,
    onClose,
    onSave,
    product
}: ProductModalProps) {
    const [formData, setFormData] = useState<Omit<Product, "id">>(() => ({
        name: product?.name || "",
        category: product?.category || "",
        price:product?.price || 0,
        quantity: product?.quantity || 0,
        minStock: product?.minStock || 0,
    }));
    const [isCustomCategory, setIsCustomCategory] = useState(false);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSave({
            id: product?.id || "",
            ...formData,
            price: isNaN(formData.price) ? 0 : formData.price,
            quantity: isNaN(formData.quantity) ? 0 : formData.quantity,
            minStock: isNaN(formData.minStock) ? 0 : formData.minStock
        });
        onClose();
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
              <DropdownField
                required
                label="Category"
                value={isCustomCategory ? "OTHER" : formData.category}
                onChange={(e) => {
                  const val = e.target.value
                  if (val == "OTHER") {
                  setIsCustomCategory(true);
                  setFormData({ ...formData, category: ""})
                  } else {
                    setIsCustomCategory(false);
                    setFormData({...formData, category: val})
                  }
                }
              } 
                className="py-2"
              >
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Stationery">Stationery</option>
                <option value="Accessories">Accessories</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="OTHER">+ Add New Category</option>
              </DropdownField>


              {isCustomCategory && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                  <InputField
                  type="text"
                  required
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
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
                label="Quantity"
                value={isNaN(formData.quantity) ? "" : formData.quantity}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value)})}
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
                onChange={(e) => setFormData({ ...formData, minStock: parseFloat(e.target.value)})}
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
                    Save Product
                  </Button>
                </div>
            </form>
        </Modal>
    );
}