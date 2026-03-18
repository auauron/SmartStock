import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { InputField } from "../ui/InputField";
import { DropdownField } from "../ui/DropdownField";
import type { Product } from "../../types";

export type { Product };

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product?: Product;
}

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
}: ProductModalProps) {
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    category: "",
    price: 0,
    quantity: 0,
    minStock: 0,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        minStock: product.minStock,
      });
    } else {
      setFormData({
        name: "",
        category: "",
        price: 0,
        quantity: 0,
        minStock: 0,
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: product?.id || Date.now().toString(),
      ...formData,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? "Edit Product" : "Add New Product"}
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
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="py-2"
        >
          <option value="">Select a category</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Stationery">Stationery</option>
          <option value="Accessories">Accessories</option>
          <option value="Office Supplies">Office Supplies</option>
        </DropdownField>

        <InputField
          type="number"
          required
          min="0"
          step="0.01"
          label="Price"
          startAdornment={<span>$</span>}
          value={formData.price}
          onChange={(e) =>
            setFormData({
              ...formData,
              price: parseFloat(e.target.value),
            })
          }
          className="py-2 pl-8"
          placeholder="0.00"
        />

        <InputField
          type="number"
          required
          min="0"
          label="Quantity"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: parseInt(e.target.value) })
          }
          className="py-2"
          placeholder="0"
        />

        <InputField
          type="number"
          required
          min="0"
          label="Minimum Stock Level"
          value={formData.minStock}
          onChange={(e) =>
            setFormData({ ...formData, minStock: parseInt(e.target.value) })
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
          <Button type="submit" className="flex-1">
            Save Product
          </Button>
        </div>
      </form>
    </Modal>
  );
}
