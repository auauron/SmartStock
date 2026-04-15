import { InventoryFactory } from "../factories/inventoryFactory";
import type { Inventory } from "../types";
import { supabase } from "../lib/supabaseClient";

export interface IInventoryService {
    getInventory(): Promise<Inventory[]>;
    saveInventory(item: Omit<Inventory, "id"> & { id?: string }): Promise<void>;
    deleteInventory(id: string): Promise<void>;
}

class InventoryService {
    async getInventory(userId: string): Promise<Inventory[]> {
        const { data, error } = await supabase
            .from("inventories")
            .select("*")
            .eq("user_id", userId);

        if (error) throw error;
        return data.map(InventoryFactory.createFromDb);
    }

    async saveInventory(item: Omit<Inventory, "id"> & {id?: string}, userId: string): Promise<void> {
        const dbData = InventoryFactory.toDb(item, userId);
        const { error } = await supabase.from("inventories").upsert(dbData);
        if (error) throw error;
    }

    async deleteInventory(id: string, userId: string): Promise<void> {
        const { error } = await supabase
            .from("inventories")
            .delete()
            .eq("id", id)
            .eq("user_id", userId);
        if (error) throw error;
    }
}

export class InventoryServiceProxy implements IInventoryService {
    private service: InventoryService = new InventoryService();

    private async getUserId() {
        const { data: { user }, error} = await supabase.auth.getUser();
        if (error || !user) throw new Error("You must be signed in to manage inventory.");
        return user.id;
    }

    async getInventory() { 
        const userId = await this.getUserId();
        return this.service.getInventory(userId); 
    }

    async saveInventory(item: Omit<Inventory, "id"> & { id?: string;}) {
        const userId = await this.getUserId();
        if (item.price < 0) throw new Error("Price cannot be negative");
        if (item.quantity < 0) throw new Error("Quantity cannot be negative");
        if (item.minStock < 0) throw new Error("minStock cannot be negative");

        console.log(`[Proxy] Logging activity: Saving inventory item ${item.name}`);
        return this.service.saveInventory(item, userId);
    }

    async deleteInventory(id: string) { 
        const userId = await this.getUserId()
        return this.service.deleteInventory(id, userId); 
    }
}