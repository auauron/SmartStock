import { ProductFactory } from "../factories/productFactory";
import type { Product } from "../types";
import { supabase } from "../lib/supabaseClient";

export interface IProductService {
    getProducts(): Promise<Product[]>;
    saveProduct(product: Omit<Product, "id"> & { id?: string }): Promise<void>;
    deleteProduct(id: string): Promise<void>;
}

class ProductService {
    async getProducts(userId: string): Promise<Product[]> {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("user_id", userId);

        if (error) throw error;
        return data.map(ProductFactory.createFromDb);
    }

    async saveProduct(product: Omit<Product, "id"> & {id?: string}, userId: string): Promise<void> {
        const dbData = ProductFactory.toDb(product, userId);
        const { error } = await supabase.from("products").upsert(dbData);
        if (error) throw error;
    }
    async deleteProduct(id: string, userId: string): Promise<void> {
        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", id)
            .eq("user_id", userId);
        if (error) throw error;
    }
}


export class ProductServiceProxy implements IProductService {
    private service: ProductService = new ProductService();

    private async getUserId() {
        const { data: { user }, error} = await supabase.auth.getUser();
        if (error || !user) throw new Error("You must be signed in to manage inventory.");
        return user.id;
    }

    async getProducts() { 

        const userId = await this.getUserId();
        return this.service.getProducts(userId); 
    }

    async saveProduct(product: Omit<Product, "id"> & { id?: string;}) {
        const userId = await this.getUserId();
        if (product.price < 0) throw new Error("Price cannot be negative");
        if (product.quantity < 0) throw new Error("Quantity cannot be negative");
        if (product.minStock < 0) throw new Error("minStock cannot be negative");


            console.log(`[Proxy] Logging activity: Saving product ${product.name}`);
            return this.service.saveProduct(product, userId);
    }

    async deleteProduct(id: string) { 
        const userId = await this.getUserId()

        return this.service.deleteProduct(id, userId); 
        
    }
}