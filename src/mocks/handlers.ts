import { http, HttpResponse} from 'msw';

// Get URL from env or use the one found in .env.test
const BASE_URL = 'https://manuzpfkmjcflcrizsmn.supabase.co/rest/v1';

// In-memory store for integration testing state
let mockInventories = [
    {
        id: 'msw-123',
        name: 'MSW Test Phone',
        category: 'Electronics',
        price: 500,
        quantity: 10,
        min_stock: 2,
        user_id: '00000000-0000-0000-0000-000000000001'
    }
];

export const handlers = [
    http.get('*/auth/v1/user', () => { 
        return HttpResponse.json({
            data: {
                user: {
                    id: '00000000-0000-0000-0000-000000000001',
                    email: 'test@example.com',
                }
            },
            error: null
        })
    }),

    // Inventories
    http.get(`${BASE_URL}/inventories*`, () => {
        return HttpResponse.json(mockInventories);
    }),

    http.post(`${BASE_URL}/inventories*`, async ({ request }) => {
        const item = await request.json() as any;
        const id = item.id || 'generated-id-' + Math.random().toString(36).substr(2, 9);
        
        // Update in-memory for integration persistence simulation
        const existingIdx = mockInventories.findIndex(i => i.id === id);
        if (existingIdx >= 0) {
            mockInventories[existingIdx] = { ...mockInventories[existingIdx], ...item };
        } else {
            mockInventories.push({ ...item, id });
        }

        return HttpResponse.json({ id }, { status: 201 });
    }),

    http.delete(`${BASE_URL}/inventories*`, () => {
        return new HttpResponse(null, { status: 204 });
    }),

    // Audit Logs
    http.post(`${BASE_URL}/audit_logs*`, () => {
        return HttpResponse.json({ success: true }, { status: 201 });
    }),

    // Products (Legacy/Cleanup)
    http.delete(`${BASE_URL}/products*`, () => {
        return new HttpResponse(null, { status: 204 });
    }),

    // Restocks (Cleanup)
    http.delete(`${BASE_URL}/restocks*`, () => {
        return new HttpResponse(null, { status: 204 });
    })
];

// Helper for tests to clear the mock store
export const clearMockStore = () => {
    mockInventories = [];
};