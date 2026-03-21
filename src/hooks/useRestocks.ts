import { useCallback, useEffect, useState } from "react";
import type {
  CreateRestockInput,
  RestockEntry,
  RestockProductOption,
} from "../types";
import {
  createRestock,
  getRestockHistory,
  getRestockProducts,
} from "../services/restockService";

export function useRestocks() {
  const [history, setHistory] = useState<RestockEntry[]>([]);
  const [products, setProducts] = useState<RestockProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [productOptions, restockHistory] = await Promise.all([
        getRestockProducts(),
        getRestockHistory(),
      ]);
      setProducts(productOptions);
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
    products,
    loading,
    submitting,
    error,
    reload: load,
    addRestock,
    clearError: () => setError(null),
  };
}
