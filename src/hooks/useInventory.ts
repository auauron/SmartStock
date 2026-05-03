import { useState, useEffect, useCallback } from "react";
import { Inventory } from "../types";
import { InventoryServiceProxy } from "../services/inventoryService";
import { notificationSubject } from "../services/notificationObserver";

const service = new InventoryServiceProxy();

let cache: Inventory[] | null = null;
let pendingLoad: Promise<Inventory[]> | null = null;

export const clearInventoryCache = () => {
  cache = null;
  pendingLoad = null;
};

function loadInventoryFromService(force = false) {
  if (cache && !force) {
    return Promise.resolve(cache);
  }

  if (!pendingLoad) {
    pendingLoad = service
      .getInventory()
      .then((data) => {
        cache = data;
        return data;
      })
      .finally(() => {
        pendingLoad = null;
      });
  }

  return pendingLoad;
}

export function useInventory() {
  const [inventory, setInventory] = useState<Inventory[]>(cache ?? []);
  const [loading, setLoading] = useState(cache === null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force = false) => {
    if (cache && !force) {
      setInventory(cache);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await loadInventoryFromService(force);
      setInventory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();

    const handleUpdate = () => {
      load(true);
    };

    window.addEventListener("inventory-updated", handleUpdate);
    return () => window.removeEventListener("inventory-updated", handleUpdate);
  }, []);

  const saveInventory = async (
    item: Omit<Inventory, "id"> & { id?: string },
  ) => {
    const savedId = await service.saveInventory(item);

    setInventory((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      let updated: Inventory[];

      if (exists) {
        updated = prev.map((i) => (i.id === item.id ? { ...i, ...item } : i));
      } else {
        updated = [
          {
            ...item,
            id: savedId as string,
            createdAt: item.createdAt ?? new Date(),
          },
          ...prev,
        ];
      }

      cache = updated;
      return updated;
    });
    window.dispatchEvent(new CustomEvent("inventory-updated"));
    notificationSubject.notify("inventory-changed");
  };

  const deleteInventory = async (id: string) => {
    await service.deleteInventory(id);

    setInventory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      cache = updated;
      return updated;
    });
    window.dispatchEvent(new CustomEvent("inventory-updated"));
    notificationSubject.notify("inventory-changed");
  };

  return {
    inventory,
    loading,
    error,
    saveInventory,
    deleteInventory,
    refresh: () => load(true),
    clearError: () => setError(null),
  };
}
