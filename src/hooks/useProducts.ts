import { useState, useEffect, useCallback } from "react";
import { Product } from "../types";
import { ProductServiceProxy } from "../services/productsService";

const service = new ProductServiceProxy();

export function useInventory() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); 


    const load = useCallback(async () => {
        try {
            const data = await service.getProducts()
            console.log(data)
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load inventory");
        } finally {
            setLoading(false)
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const saveProduct = async (product: Omit<Product, "id"> & { id?: string }) => {
    try {
        setError(null);
        const savedProduct = await service.saveProduct(product);
        setProducts((prev) => {
            const exists = prev.find((p) => p.id === savedProduct.id);
            if (exists) {
                return prev.map((p) => (p.id === savedProduct.id ? savedProduct : p));
            } else {
                return [savedProduct, ...prev]
            }
        })
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
        setProducts((prev) => prev.filter(p => p .id != id))
    } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete product");
        throw err;
    }
    };

    return { 
    products, 
    loading, 
    error,
    saveProduct, 
    deleteProduct, 
    clearError: () => setError(null) 
    };
}