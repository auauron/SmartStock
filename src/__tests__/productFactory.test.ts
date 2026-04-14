import { describe, it, expect } from 'vitest';
import { ProductFactory } from '../factories/productFactory';

describe('ProductFactory', () => {
    it('should transform database row to frontend product correctly', () => {
        const fixedDate = '2023-01-01T10:00:00.000Z';
        const mockDbRow = {
            id: 'prod_123',
            name: 'Mechanical Keyboard',
            category: 'Electronics',
            price: 150.50,
            quantity: 10,
            min_stock: 5,
            user_id: 'user_99',
            created_at: fixedDate,
            updated_at: fixedDate,
        };

        const result = ProductFactory.createFromDb(mockDbRow);

        expect(result.id).toBe('prod_123');
        expect(result.name).toBe('Mechanical Keyboard')
        expect(result.category).toBe('Electronics')
        expect(result.price).toBe(150.50)
        expect(result.quantity).toBe(10)
        expect(result.minStock).toBe(5)
        expect(result.createdAt).toBeInstanceOf(Date)
        expect(result.createdAt?.toISOString()).toBe(fixedDate)
    })

    it('should prepare data for the database correctly', () => {
        const frontendProduct = {
            name: 'Gaming Mouse',
            category: 'Accessories',
            price: 50,
            quantity: 20,
            minStock: 10,
        };

        const userId = 'user_001';
        const dbRow = ProductFactory.toDb(frontendProduct, userId)

        expect(dbRow.name).toBe('Gaming Mouse')
        expect(dbRow.category).toBe('Accessories')
        expect(dbRow.price).toBe(50)
        expect(dbRow.quantity).toBe(20)
        expect(dbRow.min_stock).toBe(10)
        expect(dbRow.user_id).toBe(userId)
    })
})