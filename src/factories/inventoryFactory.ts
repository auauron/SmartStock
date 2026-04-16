import { Inventory } from "../types";

export interface InventoryRow {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    min_stock: number;
    user_id: string;
}

export class InventoryFactory {
    static createFromDb(row: InventoryRow): Inventory {
        return {
            id: row.id,
            name: row.name,
            category: row.category,
            price: row.price,
            quantity: row.quantity,
            minStock: row.min_stock, 
        };
    }

    static toDb(inventory: Omit<Inventory, "id"> & { id?: string }, userId: string): Partial<InventoryRow> {
        return {
            ...(inventory.id && { id: inventory.id }),
            name: inventory.name,
            category: inventory.category,
            price: inventory.price,
            quantity: inventory.quantity,
            min_stock: inventory.minStock,
            user_id: userId,
        };
    }
}