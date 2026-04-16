import { AuditLogChanges } from "../types";

export interface AuditLog {
    id: string;
    userId: string;
    itemName: string;
    action: 'INSERT' | 'UPDATE' | 'DELETE';
    changes: AuditLogChanges | null;
    createdAt: Date;
}

export interface AuditLogRow {
    id: string,
    user_id: string;
    item_name: string;
    action: 'INSERT' | 'UPDATE' | 'DELETE';
    changes: AuditLogChanges | null;
    created_at: string;
}

export class AuditLogFactory {
    static createFromDb(row: AuditLogRow): AuditLog {
        return {
            id: row.id,
            userId: row.user_id,
            itemName: row.item_name,
            action: row.action,
            changes: row.changes,
            createdAt: new Date(row.created_at)
        };
    }

    static toDb(log: Omit<AuditLog, 'id' | 'createdAt'>): Omit<AuditLogRow, 'id' | 'created_at'> {
        return {
            user_id: log.userId,
            item_name: log.itemName,
            action: log.action,
            changes: log.changes
        };
    };
    
}