import { describe, it, expect, vi } from "vitest";
import { ProductServiceProxy } from "../services/productsService";
import type { Product } from "../types";

interface SupabaseResponse<T = unknown> {
    data: T | null;
    error: Error | null;
}

interface MockSupabase {
    auth: { 
        getUser: () => Promise<{ data: { user: { id: string } }; error: null }>;
    };
    from: (table: string) => MockSupabase;
    select: (columns?: string) => MockSupabase;
    delete: () => MockSupabase;
    upsert: (data: object) => Promise<{ error: Error | null }>;
    eq: (col: string, val: string | number) => MockSupabase & PromiseLike<SupabaseResponse>;
    then?: (resolve: (value: SupabaseResponse) => void) => void;
}

vi.mock('../lib/supabaseClient', () => {
    let currentMode: 'SELECT' | 'DELETE' | 'UPSERT' = 'SELECT';

    const mockSupabase: MockSupabase = {
        auth: {
            getUser: vi.fn().mockResolvedValue({
                data: { user: { id: 'test-user-123' } },
                error: null,
            }),
        },
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockImplementation(() => {
            currentMode = 'SELECT';
            return mockSupabase;
        }),
        delete: vi.fn().mockImplementation(() => {
            currentMode = 'DELETE';
            return mockSupabase;
        }),
        upsert: vi.fn().mockImplementation(async (_data: object) => {
            return { error: null };
        }),
        eq: vi.fn().mockImplementation(function (this: MockSupabase) {
            this.then = async (resolve) => {
                const mockProducts = [{
                    id: 'msw-123',
                    name: 'MSW Test Phone',
                    category: 'Electronics',
                    price: 500,
                    quantity: 10,
                    min_stock: 2,
                    user_id: 'test-user-123',
                }];

                const data = currentMode === 'SELECT' ? mockProducts : null;
                resolve({ data, error: null });
            };
            return this;
        }),
    };

    return { supabase: mockSupabase };
});

describe('ProductsService Integration (MSW)', () => {
    it('should fetch and transform products from the fake server', async () => {
        const service = new ProductServiceProxy();

        const products = await service.getProducts();

        expect(products).toHaveLength(1);
        expect(products[0].id).toBe('msw-123')
        expect(products[0].name).toBe('MSW Test Phone')
        expect(products[0]).toHaveProperty('minStock')
    })

    it('should successfully save a product through the proxy to the fake server', async () => {
        const service = new ProductServiceProxy()
        const newProduct = {
            name: 'Integration Phone',
            price: 999,
            quantity: 5,
            category: 'Electronics',
            minStock: 20
        }

        await expect(service.saveProduct(newProduct as Product)).resolves.not.toThrow();
    })

    it('should delete a product through the proxy to the fake server', async () => {
        const service = new ProductServiceProxy();
        const productId = 'msw-123';

        await expect(service.deleteProduct(productId)).resolves.not.toThrow();

    })
}) 