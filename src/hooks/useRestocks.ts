import { useCallback, useEffect, useState } from "react";
import type {
  CreateRestockInput,
  RestockEntry,
  RestockInventoryOption,
} from "../types";
import {
  createRestock,
  getRestockHistory,
  getRestockInventory,
} from "../services/restockService";

export function useRestocks() {
  const [history, setHistory] = useState<RestockEntry[]>([]);
  const [inventory, setInventory] = useState<RestockInventoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [inventoryOptions, restockHistory] = await Promise.all([
        getRestockInventory(),
        getRestockHistory(),
      ]);
      setInventory(inventoryOptions);
      setHistory(restockHistory);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Failed to load restock data.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const addRestock = useCallback(async (input: CreateRestockInput) => {
    setSubmitting(true);
    setError(null);

    try {
      const newEntry = await createRestock(input);
      setHistory((prev) => [newEntry, ...prev]);
    } catch (createError) {
      const message =
        createError instanceof Error
          ? createError.message
          : "Failed to add restock entry.";
      setError(message);
      throw createError;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    history,
    inventory, // renamed from products for consistency
    loading,
    submitting,
    error,
    reload: load,
    addRestock,
    clearError: () => setError(null),
  };
}
