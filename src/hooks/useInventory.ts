import { useState, useEffect, useCallback } from "react";
import { Inventory } from "../types";
import { InventoryServiceProxy } from "../services/inventoryService";

const service = new InventoryServiceProxy();

let cache: Inventory[] | null = null;

export const clearInventoryCache = () => {
    cache = null;
};

export function useInventory() {
    const [inventory, setInventory] = useState<Inventory[]>(cache ?? []);
    const [loading, setLoading] = useState(cache === null);
    const [error, setError] = useState<string | null>(null); 

    const load = useCallback(async (force = false) => {
        if (cache && !force) return;

        setLoading(true);
        setError(null);
        try {
            const data = await service.getInventory();
            cache = data;
            setInventory(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load inventory");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        load();
    }, [load]);

    const saveInventory = async (item: Omit<Inventory, "id"> & { id?: string }) => {
        const savedId = await service.saveInventory(item);
        
        setInventory((prev) => {
            const exists = prev.find((i) => i.id === item.id);
            let updated: Inventory[];
            
            if (exists) {
                updated = prev.map((i) => (i.id === item.id ? { ...i, ...item } : i));
            } else {
                updated = [...prev, { ...item, id: savedId as string }];
            }

            cache = updated;
            return updated;
        });
    };

    const deleteInventory = async (id: string) => {
        await service.deleteInventory(id);

        setInventory((prev) => {
            const updated = prev.filter((item) => item.id !== id);
            cache = updated;
            return updated;
        });
    };

    return { 
        inventory,
        loading, 
        error,
        saveInventory, 
        deleteInventory, 
        refresh: () => load(true),
        clearError: () => setError(null) 
    };
}