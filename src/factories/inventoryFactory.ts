import { Inventory } from "../types";
export interface ProductRow {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    min_stock: number;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export class InventoryFactory {

static createFromDb(row: ProductRow): Inventory {
    const defaultDate = new Date().toISOString();
    return {
        id: row.id,
        name: row.name,
        category: row.category,
        price: row.price,
        quantity: row.quantity,
        minStock: row.min_stock, 
        createdAt: new Date(row.created_at || defaultDate),
        updatedAt: new Date(row.updated_at || defaultDate),
    };
}

static toDb(product: Omit<Inventory, "id"> & { id?: string }, userId: string): Partial<ProductRow> {
    return {
        ...(product.id && { id: product.id }),
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        min_stock: product.minStock,
        user_id: userId,
        };
    }
}