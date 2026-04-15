import { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Search, Filter, Loader2, ArrowUpDown } from "lucide-react"; 
import { InventoryModal } from "../components/inventory/InventoryModal";
import type { Inventory } from "../types";
import { Button } from "../components/ui/Button";
import { InputField } from "../components/ui/InputField";
import { DropdownField } from "../components/ui/DropdownField";
import { useInventory } from "../hooks/useInventory";
import { DeleteConfirmationModal }  from "../components/inventory/DeleteConfirmationModal";

export function Inventory() {
  const { inventory, loading, saveInventory, deleteInventory, error, clearError } = useInventory();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Inventory | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const getStatus = (item: Inventory) => {
    if (item.quantity === 0)
      return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
    if (item.quantity < item.minStock)
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-700" };
    return { label: "In Stock", color: "bg-green-100 text-green-700" };
  };

  const handleSave = async (itemData: Inventory): Promise<void> => {
    try {
      await saveInventory(itemData);
      setIsModalOpen(false);
      setEditingItem(undefined);
    } catch (err) {
      console.error("UI Error Catch:", err);
      throw err;
    }
  };

  const openDeleteConfirm = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteInventory(itemToDelete);
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  }

  const filteredItems = useMemo(() => {
    const result = [...inventory].filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !filterCategory || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "quantity-asc":
        result.sort((a, b) => a.quantity - b.quantity);
        break;
      case "quantity-desc":
        result.sort((a, b) => b.quantity - a.quantity);
        break;
    }

    return result;
  }, [inventory, searchQuery, filterCategory, sortBy]);

  const categories = useMemo(() => Array.from(new Set(inventory.map((p) => p.category))), [inventory]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
          <p className="text-gray-600 mt-1">Manage your stock inventory</p>
        </div>
        <Button
        onClick={() => {
          setEditingItem(undefined)
          setIsModalOpen(true);
        }}
        >
          <Plus className="w-5 h-5"/>
            Add Item
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button onClick={clearError} className="absolute top-0 bottom-0 right-0 px-4 py-3">
            Dismiss
          </button>
        </div>
      )}
      
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <InputField
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
              className="py-2"
              />
          </div>
          <div className="sm:w-48 relative">
            <DropdownField
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              icon={ArrowUpDown}
              className="py-2"
            >
              <option value="latest">Latest</option>
              <option value="name-asc">Name (A to Z)</option>
              <option value="name-desc">Name (Z to A)</option>
              <option value="price-asc">Price (Low - High)</option>
              <option value="price-desc">Price (High - Low)</option>
              <option value="quantity-asc">Quantity (Low - High)</option>
              <option value="quantity-desc">Quantity (High - Low)</option>
            </DropdownField>
          </div>
          <div className="sm:w-48 relative">
            <DropdownField
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            icon={Filter}
            className="py-2"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </DropdownField>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                    No items match your filters
                  </td>
                </tr>
              ) : (
              filteredItems.map((item) => {
                const status = getStatus(item);
                return(
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          aria-label={`Edit item ${item.name}`}
                          onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          aria-label={`Delete item ${item.name}`}
                          data-testid="delete-item-button"
                          onClick={() => openDeleteConfirm(item.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4"/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InventoryModal
      key={editingItem?.id || "new-item"}
      isOpen={isModalOpen}
      onClose={() => { setIsModalOpen(false); setEditingItem(undefined); }}
      onSave={handleSave}
      item={editingItem}
      existingCategories={categories}
      />

      <DeleteConfirmationModal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      onConfirm={confirmDelete}
      title="Delete Inventory Item"
      message="Are you sure you want to delete this inventory item?"
      />
    </div>
  )
}