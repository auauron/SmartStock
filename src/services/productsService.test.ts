import { describe, expect, it, vi, beforeEach } from "vitest";
import { ProductServiceProxy } from "./productsService";

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'mock-user-123' } }, error: null }),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockResolvedValue({ error: null }),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
  },
}));

describe('ProductServiceProxy', () => {
    beforeEach(() => {
    vi.clearAllMocks(); 
    });

    it('Should THROW an error if the price is negative', async () => {
        const service = new ProductServiceProxy()

        const badProduct = {
            name: 'Illegal Product',
            category: 'Accessories',
            price: -50,
            quantity: 5,
            minStock: 1,
        }

        await expect(service.saveProduct(badProduct))
            .rejects
            .toThrow('Price cannot be negative');
    });

    it('should log a message to the console when saving', async () => {
        const consoleSpy = vi.spyOn(console, 'log');
        const service = new ProductServiceProxy()

        const goodProduct = {
            name: 'Valid Product',
            category: 'Electronics',
            price: 80,
            quantity: 10,
            minStock: 15,
        }

        try {
            await service.saveProduct(goodProduct);
        } finally {
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('[Proxy] Logging activity')
            );
            consoleSpy.mockRestore();
        }
    })
})