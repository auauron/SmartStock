import { describe, it, expect, vi } from "vitest";
import { InventoryServiceProxy } from "../services/inventoryService";
import type { Inventory } from "../types";

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
    upsert: (data: object) => MockSupabase;
    eq: (col: string, val: string | number) => MockSupabase & PromiseLike<SupabaseResponse>;
    single: () => Promise<SupabaseResponse>;
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
        upsert: vi.fn().mockImplementation(() => {
            currentMode = 'UPSERT';
            return mockSupabase;
        }),
        single: vi.fn().mockImplementation(async () => {
            if (currentMode === 'UPSERT') {
                return { data: { id: 'mock-id' }, error: null };
            }
            return { data: null, error: null };
        }),
        eq: vi.fn().mockImplementation(function (this: MockSupabase) {
            this.then = async (resolve) => {
                const mockInventory = [{
                    id: 'msw-123',
                    name: 'MSW Test Phone',
                    category: 'Electronics',
                    price: 500,
                    quantity: 10,
                    min_stock: 2,
                    user_id: 'test-user-123',
                }];

                const data = currentMode === 'SELECT' ? mockInventory : null;
                resolve({ data, error: null });
            };
            return this;
        }),
    };

    return { supabase: mockSupabase };
});

describe('InventoryServiceProxy Integration', () => {
	const service = new InventoryServiceProxy();

	it('should fetch inventory records', async () => {
		const items = await service.getInventory();
		expect(items).toHaveLength(1);
		expect(items[0].name).toBe('MSW Test Phone');
	});

	it('should save a new inventory record', async () => {
		const newItem: Omit<Inventory, 'id'> = {
			name: 'Save Test',
			category: 'Test',
			price: 10,
			quantity: 1,
			minStock: 0,
		};
		const savedId = await service.saveInventory(newItem);
		expect(savedId).toBe('mock-id');
	});

	it('should handle deletion of records', async () => {
		// Mock needs to handle getInventoryById which is called before delete
		await service.deleteInventory('msw-123');
	});
});