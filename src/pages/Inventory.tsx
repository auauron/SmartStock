import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { InventoryModal } from "../components/inventory/InventoryModal";
import type { Inventory } from "../types";
import { Button } from "../components/ui/Button";
import { InputField } from "../components/ui/InputField";
import { DropdownField } from "../components/ui/DropdownField";
import { useInventory } from "../hooks/useInventory";
import { DeleteConfirmationModal } from "../components/inventory/InventoryDeleteModal";
import { ToastContainer, useToast } from "../components/ui/Toast";
import { useAuditLogs } from "../hooks/useAuditLog";
import { InventoryTable } from "../components/inventory/InventoryTable";

const UNDO_DELAY_MS = 5000;

export function Inventory() {
  const {
    inventory,
    loading,
    saveInventory,
    deleteInventory,
    error,
    clearError,
  } = useInventory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Inventory | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Inventory | null>(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<string>>(
    new Set()
  );
  const pendingTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, sortBy]);

  const { refresh: refreshLogs } = useAuditLogs();
  const { toasts, addToast, dismissToast } = useToast();

  const handleSave = async (itemData: Inventory): Promise<void> => {
    try {
      await saveInventory(itemData);
      await refreshLogs();
      setIsModalOpen(false);
      setEditingItem(undefined);
    } catch (err) {
      console.error("UI Error Catch:", err);
      throw err;
    }
  };

  const undoDelete = useCallback((id: string) => {
    const timer = pendingTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      pendingTimers.current.delete(id);
    }
    setPendingDeleteIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    const item = itemToDelete;
    setIsDeleteModalOpen(false);
    setItemToDelete(null);

    setPendingDeleteIds((prev) => new Set(prev).add(item.id));

    const toastId = addToast({
      message: `"${item.name}" deleted.`,
      durationMs: UNDO_DELAY_MS,
      onUndo: () => undoDelete(item.id),
    });

    const timer = setTimeout(async () => {
      pendingTimers.current.delete(item.id);
      try {
        await deleteInventory(item.id);
        await refreshLogs();
      } catch (err) {
        console.error("Delete failed:", err);
        undoDelete(item.id);
      }
      setPendingDeleteIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
      dismissToast(toastId);
    }, UNDO_DELAY_MS);

    pendingTimers.current.set(item.id, timer);
  };

  const visibleItems = useMemo(
    () => inventory.filter((item) => !pendingDeleteIds.has(item.id)),
    [inventory, pendingDeleteIds]
  );

  const filteredItems = useMemo(() => {
    const result = [...visibleItems].filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        !filterCategory || item.category === filterCategory;
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
  }, [visibleItems, searchQuery, filterCategory, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  );
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const categories = useMemo(
    () => Array.from(new Set(inventory.map((p) => p.category))),
    [inventory]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 sm:px-5">
        <p className="text-sm text-gray-600">
          Track stock levels, pricing, and categories in one place.
        </p>
        <Button
          onClick={() => {
            setEditingItem(undefined);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-5 h-5" />
          Add Item
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={clearError}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
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
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </DropdownField>
          </div>
        </div>
      </div>

      <InventoryTable
        items={paginatedItems}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onEdit={(item) => {
          setEditingItem(item);
          setIsModalOpen(true);
        }}
        onDelete={(item) => {
          setItemToDelete(item);
          setIsDeleteModalOpen(true);
        }}
      />

      <InventoryModal
        key={editingItem?.id || "new-item"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(undefined);
        }}
        onSave={handleSave}
        item={editingItem}
        existingCategories={categories}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        itemName={itemToDelete?.name}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
