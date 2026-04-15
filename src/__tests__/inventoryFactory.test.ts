import { describe, it, expect } from 'vitest';
import { InventoryFactory } from '../factories/inventoryFactory';

describe('InventoryFactory', () => {
    it('should transform database row to frontend inventory item correctly', () => {
        const mockDbRow = {
            id: 'inv_123',
            name: 'Mechanical Keyboard',
            category: 'Electronics',
            price: 150.50,
            quantity: 10,
            min_stock: 5,
            user_id: 'user_99'
        };

        const result = InventoryFactory.createFromDb(mockDbRow);

        expect(result.id).toBe('inv_123');
        expect(result.name).toBe('Mechanical Keyboard')
        expect(result.category).toBe('Electronics')
        expect(result.price).toBe(150.50)
        expect(result.quantity).toBe(10)
        expect(result.minStock).toBe(5)
    })

    it('should prepare data for the database correctly', () => {
        const frontendItem = {
            name: 'Gaming Mouse',
            category: 'Accessories',
            price: 50,
            quantity: 20,
            minStock: 10,
        };

        const userId = 'user_001';
        const dbRow = InventoryFactory.toDb(frontendItem, userId)

        expect(dbRow.name).toBe('Gaming Mouse')
        expect(dbRow.category).toBe('Accessories')
        expect(dbRow.price).toBe(50)
        expect(dbRow.quantity).toBe(20)
        expect(dbRow.min_stock).toBe(10)
        expect(dbRow.user_id).toBe(userId)
    })
})