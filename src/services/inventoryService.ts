import type { AuditLog, AuditLogChanges, AuditLogKey, Inventory } from "../types";
import { supabase } from "../lib/supabaseClient";
import { InventoryFactory, ProductRow } from "../factories/inventoryFactory";
import { AuditLogFactory } from "../factories/auditLogFactory";



export interface IInventoryService {
    getInventory(): Promise<Inventory[]>;
    saveInventory(item: Omit<Inventory, "id"> & { id?: string }): Promise<string | undefined>;
    deleteInventory(id: string): Promise<void>;
    logActivity(userId: string, itemName: string, action: 'INSERT' | 'UPDATE' | 'DELETE', change?: AuditLogChanges | null): Promise<void>;
    getAuditLogs(): Promise<AuditLog[]>;
}

class InventoryService {
    async getInventory(userId: string): Promise<Inventory[]> {
        const { data, error } = await supabase
            .from("inventories")
            .select("*")
            .eq("user_id", userId);

        if (error) throw error;
        return (data || []).map(InventoryFactory.createFromDb);
    }

    async getInventoryById(id: string, userId: string): Promise<Inventory | null> {
        const { data, error } = await supabase
            .from('inventories')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .maybeSingle();
            
        if (error) throw error;
        return data ? InventoryFactory.createFromDb(data as ProductRow) : null;
    }

    async saveInventory(item: Omit<Inventory, "id"> & { id?: string }, userId: string): Promise<string> {
        const dbData = InventoryFactory.toDb(item, userId);
        const { data, error } = await supabase
            .from("inventories")
            .upsert(dbData)
            .select('id')
            .single();
            
        if (error) throw error;
        return data.id;
    }

    async deleteInventory(id: string, userId: string): Promise<void> {
        const { error } = await supabase
            .from("inventories")
            .delete()
            .eq("id", id)
            .eq("user_id", userId);
        if (error) throw error;
    }

    async logActivity(
        userId: string, 
        itemName: string, 
        action: 'INSERT' | 'UPDATE' | 'DELETE', 
        changes: AuditLogChanges | null = null
    ): Promise<void> {

        const dbData = AuditLogFactory.toDb({
            userId,
            itemName,
            action,
            changes
        });
        const { error } = await supabase.from('audit_logs').insert(dbData);

        if (error) {
            throw error;
        }
    }

    async getAuditLogs(userId: string): Promise<AuditLog[]> {
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(AuditLogFactory.createFromDb);
    }
}

export class InventoryServiceProxy implements IInventoryService {
    private service: InventoryService = new InventoryService();

    private async getUserId() {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) throw new Error("You must be signed in to manage inventory.");
        return user.id;
    }

    async getInventory() {
        const userId = await this.getUserId();
        return this.service.getInventory(userId);
    }


    async saveInventory(item: Omit<Inventory, "id"> & { id?: string }): Promise<string | undefined> {
        if (!Number.isFinite(item.price) || item.price < 0) throw new Error("Price must be a valid non-negative number");
        if (!Number.isFinite(item.quantity) || item.quantity < 0) throw new Error("Quantity must be a valid non-negative number");
        if (!Number.isFinite(item.minStock) || item.minStock < 0) throw new Error("Minimum stock must be a valid non-negative number");

        const userId = await this.getUserId();

        let oldItem: Inventory | null = null;

        if (item.id) {
            try {
                oldItem = await this.service.getInventoryById(item.id, userId);
            } catch (e) {
                console.error(e)
            }
        } 

        const savedId = await this.service.saveInventory(item, userId);

        try {
            const changes: AuditLogChanges = {};
            const keys: AuditLogKey[] = ['name', 'category', 'price', 'quantity', 'minStock'];

            keys.forEach((key) => {
                const oldVal = oldItem ? oldItem[key] : undefined;
                const newVal = item[key as keyof typeof item];

                if (oldVal !== newVal) {
                    const stringify = (val: string | number | Date | null | undefined): string | number | null => {
                        if (val instanceof Date) return val.toISOString();
                        if (typeof val === 'string' || typeof val === 'number') return val;
                        return null;
                    };

                    changes[key] = { from: stringify(oldVal), to: stringify(newVal) };
                }
            });

            const action = oldItem ? 'UPDATE' : 'INSERT';
            
            if (!oldItem || Object.keys(changes).length > 0) {
                console.log(`[Proxy] Logging activity: ${action} ${item.name}`);
                await this.service.logActivity(userId, item.name, action, changes);
            }
        } catch (logError) {
            console.error("Audit Log Error (Inventory saved successfully):", logError);
        }
        return savedId;
    }

async deleteInventory(id: string) {
    const userId = await this.getUserId();
    
    const item = await this.service.getInventoryById(id, userId);
    if (!item) throw new Error("Item not found (404)");

    await this.service.deleteInventory(id, userId);
    
    try {
        console.log(`[Proxy] Logging activity: DELETE ${item.name}`);
        await this.service.logActivity(userId, item.name, 'DELETE');
    } catch (logError) {
        console.error("Delete Log Error:", logError);
    }
}

    async logActivity(
        userId: string, 
        itemName: string, 
        action: 'INSERT' | 'UPDATE' | 'DELETE', 
        changes?: AuditLogChanges | null
    ): Promise<void> {
        return this.service.logActivity(userId, itemName, action, changes);
    }

    async getAuditLogs() {
        const userId = await this.getUserId();
        return this.service.getAuditLogs(userId);
    }
}