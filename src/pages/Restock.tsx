import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useRestocks } from "../hooks/useRestocks";
import {
  RestockAddForm,
  type RestockFormData,
} from "../components/restock/RestockAddForm";
import { RestockHistoryTable } from "../components/restock/RestockHistoryTable";

interface RestockPrefillState {
  prefillInventoryId?: string;
  prefillQuantity?: number;
}

export function Restock() {
  const location = useLocation();
  const {
    history,
    inventory,
    loading,
    submitting,
    error,
    addRestock,
    clearError,
  } = useRestocks();

  const [formData, setFormData] = useState<RestockFormData>({
    inventoryId: "",
    quantity: "",
    notes: "",
  });
  const hasAppliedPrefill = useRef(false);
  const [formKey, setFormKey] = useState(0);
  const [validationError, setValidationError] = useState("");

  const [historyInventoryFilter, setHistoryInventoryFilter] = useState("");
  const [historyDateFilter, setHistoryDateFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setCurrentPage(1);
  }, [historyInventoryFilter, historyDateFilter]);

  useEffect(() => {
    const state = (location.state ?? null) as RestockPrefillState | null;

    if (hasAppliedPrefill.current || !state?.prefillInventoryId) {
      return;
    }

    const selectedItemExists = inventory.some(
      (item) => item.id === state.prefillInventoryId,
    );

    if (!selectedItemExists) {
      if (loading) {
        return;
      }
      hasAppliedPrefill.current = true;
      return;
    }

    setFormData((prev) => ({
      ...prev,
      inventoryId: state.prefillInventoryId ?? "",
      quantity:
        typeof state.prefillQuantity === "number" && state.prefillQuantity > 0
          ? String(state.prefillQuantity)
          : prev.quantity,
    }));
    setValidationError("");
    hasAppliedPrefill.current = true;
  }, [inventory, loading, location.state]);

  const filteredHistory = useMemo(() => {
    let result = history;
    if (historyInventoryFilter) {
      result = result.filter(
        (entry) => entry.inventoryName === historyInventoryFilter,
      );
    }
    if (historyDateFilter !== "all" && historyDateFilter !== "") {
      const now = new Date();
      const past = new Date();
      if (historyDateFilter === "7days") {
        past.setDate(now.getDate() - 7);
      } else if (historyDateFilter === "30days") {
        past.setDate(now.getDate() - 30);
      }
      result = result.filter((entry) => new Date(entry.date) >= past);
    }
    return result;
  }, [history, historyInventoryFilter, historyDateFilter]);

  const totalItems = filteredHistory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredHistory.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredHistory, currentPage, itemsPerPage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    if (!formData.inventoryId) {
      setValidationError(
        "Please select an item before adding a restock entry.",
      );
      return;
    }

    const quantityValue = Number.parseInt(formData.quantity, 10);
    if (Number.isNaN(quantityValue) || quantityValue < 1) {
      setValidationError("Please enter a valid quantity.");
      return;
    }

    try {
      await addRestock({
        inventoryId: formData.inventoryId,
        quantityAdded: quantityValue,
        notes: formData.notes,
      });
      setFormData({ inventoryId: "", quantity: "", notes: "" });
      setFormKey((k) => k + 1);
    } catch {
      // Error is handled by the hook
    }
  };

  return (
    <div className="space-y-6">
      <RestockAddForm
        formKey={formKey}
        formData={formData}
        inventory={inventory}
        loading={loading}
        submitting={submitting}
        errorMessage={error || validationError}
        onDismissError={() => {
          if (error) clearError();
          setValidationError("");
        }}
        onInventoryChange={(value) => {
          setFormData((prev) => ({ ...prev, inventoryId: value }));
          if (validationError) setValidationError("");
        }}
        onQuantityChange={(value) => {
          setFormData((prev) => ({ ...prev, quantity: value }));
          if (validationError) setValidationError("");
        }}
        onNotesChange={(value) => {
          setFormData((prev) => ({ ...prev, notes: value }));
        }}
        onSubmit={handleSubmit}
      />

      <RestockHistoryTable
        loading={loading}
        inventory={inventory}
        dateFilter={historyDateFilter}
        inventoryFilter={historyInventoryFilter}
        onDateFilterChange={setHistoryDateFilter}
        onInventoryFilterChange={setHistoryInventoryFilter}
        rows={paginatedHistory}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        hasNoResults={filteredHistory.length === 0}
      />
    </div>
  );
}
