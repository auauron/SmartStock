import { Product } from "../types";
interface ProductRow {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    min_stock: number;
    user_id: string;
}

export class ProductFactory {

static createFromDb(row: ProductRow): Product {
    return {
        id: row.id,
        name: row.name,
        category: row.category,
        price: row.price,
        quantity: row.quantity,
        minStock: row.min_stock, 
    };
}

static toDb(product: Omit<Product, "id"> & { id?: string }, userId: string): Partial<ProductRow> {
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