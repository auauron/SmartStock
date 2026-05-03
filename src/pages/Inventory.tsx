import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { InventoryModal } from "../components/inventory/InventoryModal";
import type { Inventory } from "../types";
import { Button } from "../components/ui/Button";
import { InputField } from "../components/ui/InputField";
import { DropdownField } from "../components/ui/DropdownField";
import { useInventory } from "../hooks/useInventory";
import { DeleteConfirmationModal } from "../components/inventory/DeleteConfirmationModal";
import { InventorySkeleton } from "../components/inventory/InventorySkeleton";
import { ToastContainer, useToast } from "../components/ui/Toast";
import { useAuditLogs } from "../hooks/useAuditLog";
import { Pagination } from "../components/ui/Pagination";
import { ActionMenu } from "../components/ui/ActionMenu";

const UNDO_DELAY_MS = 5000;
const ONBOARDING_ACTIVE_KEY = "smartstock:onboarding-active";

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
    new Set(),
  );
  const pendingTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, sortBy]);

  useEffect(() => {
    if (searchParams.get("newItem") !== "1") return;

    const timer = window.setTimeout(() => {
      setEditingItem(undefined);
      setIsModalOpen(true);

      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("newItem");
      nextParams.delete("onboarding");
      setSearchParams(nextParams, { replace: true });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [searchParams, setSearchParams]);

  const { refresh: refreshLogs } = useAuditLogs();
  const { toasts, addToast, dismissToast } = useToast();

  const handleSave = async (itemData: Inventory): Promise<void> => {
    const isNewItem = !itemData.id;

    try {
      await saveInventory(itemData);
      await refreshLogs();
      setIsModalOpen(false);
      setEditingItem(undefined);

      if (isNewItem) {
        const onboardingActive =
          localStorage.getItem(ONBOARDING_ACTIVE_KEY) === "true";

        addToast({
          message: onboardingActive
            ? "First item added! Inventory is ready to track."
            : `"${itemData.name}" added to inventory.`,
          durationMs: 4000,
        });

        if (onboardingActive) {
          window.dispatchEvent(
            new CustomEvent("smartstock:onboarding-item-added", {
              detail: { name: itemData.name },
            }),
          );
        }
      }
    } catch (err) {
      console.error("UI Error Catch:", err);
      throw err;
    }
  };

  const openDeleteConfirm = (item: Inventory) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
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
    [inventory, pendingDeleteIds],
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
      case "latest":
        result.sort(
          (a, b) =>
            (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
        );
        break;
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
    Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
  );
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const categories = useMemo(
    () => Array.from(new Set(inventory.map((p) => p.category))),
    [inventory],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 sm:px-5">
        <div>
          <p className="text-sm font-medium text-gray-900">
            Inventory is where every stock item lives.
          </p>
          <p className="text-xs text-gray-500">
            Search, update quantities, and check stock status at a glance.
          </p>
        </div>
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

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <InventorySkeleton rows={5} />
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center"
                  >
                    <div className="mx-auto max-w-sm">
                      <p className="text-sm font-semibold text-gray-900">
                        {visibleItems.length === 0
                          ? "Your inventory is empty"
                          : "No matching products"}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {visibleItems.length === 0
                          ? "Start by adding one product. You only need a name, category, price, quantity, and minimum stock level."
                          : "Try another name or category, or clear your filters."}
                      </p>
                      <div className="mt-4 flex justify-center gap-2">
                        {visibleItems.length === 0 ? (
                          <Button
                            size="sm"
                            onClick={() => {
                              setEditingItem(undefined);
                              setIsModalOpen(true);
                            }}
                          >
                            <Plus className="h-4 w-4" />
                            Add product
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setSearchQuery("");
                              setFilterCategory("");
                            }}
                          >
                            Clear filters
                          </Button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => {
                  const status = getStatus(item);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 capitalize">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 capitalize">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <ActionMenu
                          items={[
                            {
                              label: "Edit Item",
                              icon: Edit2,
                              onClick: () => {
                                setEditingItem(item);
                                setIsModalOpen(true);
                              },
                            },
                            {
                              label: "Delete Item",
                              icon: Trash2,
                              onClick: () => openDeleteConfirm(item),
                              variant: "danger",
                            },
                          ]}
                          ariaLabel={`Actions for ${item.name}`}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredItems.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm bg-gray-50/50">
            <span className="text-gray-500 font-medium">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} of{" "}
              {filteredItems.length} items
            </span>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

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

function getStatus(item: Inventory) {
  if (item.quantity === 0)
    return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
  if (item.quantity < item.minStock)
    return { label: "Low Stock", color: "bg-yellow-100 text-yellow-700" };
  return { label: "In Stock", color: "bg-green-100 text-green-700" };
}
