import { describe, expect, it, vi, beforeEach } from "vitest";
import { InventoryServiceProxy } from "../services/inventoryService";

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'mock-user-123' } }, error: null }),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockImplementation(async () => ({ data: { id: 'mock-id' }, error: null })),
    maybeSingle: vi.fn().mockImplementation(async () => ({ data: { id: 'mock-id' }, error: null })),
  },
}));

describe('InventoryServiceProxy', () => {
    beforeEach(() => {
        vi.clearAllMocks(); 
    });

    it('Should THROW an error if the price is invalid or negative', async () => {
        const service = new InventoryServiceProxy()

        const badPrice = {
            name: 'Illegal Item',
            category: 'Accessories',
            price: -50,
            quantity: 5,
            minStock: 1,
        }
        await expect(service.saveInventory(badPrice))
            .rejects
            .toThrow('Price must be a valid non-negative number');

        const nanPrice = { ...badPrice, price: NaN };
        await expect(service.saveInventory(nanPrice))
            .rejects
            .toThrow('Price must be a valid non-negative number');
    });

    it('Should THROW an error if quantity or minStock is invalid', async () => {
        const service = new InventoryServiceProxy();
        
        const badQuantity = {
            name: 'Illegal Item',
            category: 'Accessories',
            price: 10,
            quantity: -1,
            minStock: 1,
        }
        await expect(service.saveInventory(badQuantity))
            .rejects
            .toThrow('Quantity must be a valid non-negative number');

        const badMinStock = { ...badQuantity, quantity: 10, minStock: -5 };
        await expect(service.saveInventory(badMinStock))
            .rejects
            .toThrow('Minimum stock must be a valid non-negative number');
    });

    it('should log a message to the console when saving', async () => {
        const consoleSpy = vi.spyOn(console, 'log');
        const service = new InventoryServiceProxy()

        const goodItem = {
            name: 'Valid Item',
            category: 'Electronics',
            price: 80,
            quantity: 10,
            minStock: 15,
        }

        await service.saveInventory(goodItem);
        
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('[Proxy] Logging activity')
        );
        
        consoleSpy.mockRestore();
    })
})