import { describe, expect, it } from "vitest"
import { AuditLogFactory, AuditLogRow } from "../factories/auditLogFactory";
import { AuditLog } from "../types";


describe('AuditLogFactory', () => {
    it('should transform database row to frontend audit log item correctly', () => {
        const fixedDate = '2023-01-01T10:00:00.000Z';
        const mockDbRow: AuditLogRow = {
            id: 'log_123',
            user_id: 'user_001',
            item_name: 'Mouse',
            action: 'INSERT',
            changes: null,
            created_at: fixedDate,
        }

        const result = AuditLogFactory.createFromDb(mockDbRow);

        expect(result.id).toBe('log_123');
        expect(result.userId).toBe('user_001');
        expect(result.itemName).toBe('Mouse');
        expect(result.action).toBe('INSERT');
        expect(result.changes).toBe(null);
        expect(result.createdAt.toISOString()).toBe(fixedDate);
    })

    it('should prepare data for the database correctly', () => {
        const mockDbRow: Omit<AuditLog, 'id' | 'createdAt'> = {
            userId: 'user_99',
            itemName: 'Eraser',
            action: 'DELETE',
            changes: null,
        }

        const result = AuditLogFactory.toDb(mockDbRow);

        expect(result.user_id).toBe('user_99');
        expect(result.item_name).toBe('Eraser');
        expect(result.action).toBe('DELETE');
        expect(result.changes).toBe(null);
    })

    it('should return Invalid Date when created_at is malformed (sad path)', () => {
        const malformedRow: AuditLogRow = {
            id: 'log_bad_date',
            user_id: 'user_001',
            item_name: 'Mouse',
            action: 'UPDATE',
            changes: null,
            created_at: 'not-a-real-date',
        };

        const result = AuditLogFactory.createFromDb(malformedRow);

        expect(result.createdAt).toBeInstanceOf(Date);
        expect(Number.isNaN(result.createdAt.getTime())).toBe(true);
    })
})