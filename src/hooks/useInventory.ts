import { useState, useEffect, useCallback } from "react";
import { Inventory } from "../types";
import { InventoryServiceProxy } from "../services/inventoryService";

const service = new InventoryServiceProxy();

export function useInventory() {
    const [inventory, setInventory] = useState<Inventory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); 

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await service.getInventory();
            setInventory(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to load inventory";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        load().catch(() => {
            // Error state is already handled inside load's catch block
        }); 
    }, [load]);

    const saveInventory = async (item: Omit<Inventory, "id"> & { id?: string }) => {
        try {
            setError(null);
            await service.saveInventory(item);
            await load();
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to save inventory item";
            setError(msg);
            throw err; 
        }
    };

    const deleteInventory = async (id: string) => {
        try {
            setError(null);
            await service.deleteInventory(id);
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete inventory item");
            throw err;
        }
    };

    return { 
        inventory, // exported state
        loading, 
        error,
        saveInventory, 
        deleteInventory, 
        refresh: load,
        clearError: () => setError(null) 
    };
}