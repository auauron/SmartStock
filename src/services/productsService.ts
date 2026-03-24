import { supabase } from "../lib/supabaseClient";
import { Product } from "../types";
import { ProductFactory } from "../factories/productFactory";

// 1. Define an Interface (Requirement for Proxy)
export interface IProductService {
    getProducts(): Promise<Product[]>;
    saveProduct(product: Omit<Product, "id"> & { id?: string }): Promise<void>;
    deleteProduct(id: string): Promise<void>;
}

// 2. The Concrete Implementation
class ProductService implements IProductService {
    private async getUserId() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("You must be signed in to manage inventory.");
    return user.id;
    }

    async getProducts(): Promise<Product[]> {
    const userId = await this.getUserId();
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", userId);
    
    if (error) throw error;
    return data.map(ProductFactory.createFromDb);
    }

    async saveProduct(product: Omit<Product, "id"> & { id?: string }): Promise<void> {
    const userId = await this.getUserId();
    const dbData = ProductFactory.toDb(product, userId);
    const { error } = await supabase.from("products").upsert(dbData);
    if (error) throw error;
    }

    async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    }
}

// 3. The Proxy Pattern: Adds a validation/protection layer
export class ProductServiceProxy implements IProductService {
    private service: ProductService = new ProductService();

    async getProducts() { return this.service.getProducts(); }

    async saveProduct(product: Omit<Product, "id"> & { id?: string }) {
    // Structural Pattern logic: Validation before reaching the Service
    if (product.price < 0) throw new Error("Price cannot be negative");
    if (product.quantity < 0) throw new Error("Quantity cannot be negative");
    
        console.log(`[Proxy] Logging activity: Saving product ${product.name}`);
        return this.service.saveProduct(product);
    }

    async deleteProduct(id: string) { return this.service.deleteProduct(id); }
}