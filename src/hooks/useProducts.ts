import { useState, useEffect, useCallback } from "react";
import { Product } from "../types";
import { ProductServiceProxy } from "../services/productsService";

const service = new ProductServiceProxy();

export function useInventory() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); 


    const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
        const data = await service.getProducts();
        setProducts(data);
    } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load inventory");
    } finally {
        setLoading(false);
    }
    }, []);

    useEffect(() => { load(); }, [load]);

    const saveProduct = async (product: Omit<Product, "id"> & { id?: string }) => {
    try {
        setError(null);
        await service.saveProduct(product);
        await load();
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to save product";
        setError(msg);
        throw err; 
    }
    };

    const deleteProduct = async (id: string) => {
    try {
        setError(null);
        await service.deleteProduct(id);
        await load();
    } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete product");
    }
    };

    return { 
    products, 
    loading, 
    error,
    saveProduct, 
    deleteProduct, 
    refresh: load,
    clearError: () => setError(null) 
    };
}