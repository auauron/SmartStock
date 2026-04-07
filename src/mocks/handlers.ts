import { http, HttpResponse} from 'msw';


export const handlers = [
    http.get('*/auth/v1/user', () => { 
        return HttpResponse.json({
            id: 'test-user-123',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'test@example.com',
            email_confirmed_at: '2024-01-01T00:00:00Z',
            app_metadata: { provider: 'email' },
            user_metadata: {},
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            last_sign_in_at: '2024-01-01T00:00:00Z',
        })
    }),

    http.get('*/rest/v1/products*', () => {
        return HttpResponse.json([
            {
                id: 'msw-123',
                name: 'MSW Test Phone',
                category: 'Electronics',
                price: 500,
                quantity: 10,
                min_stock: 2
            }
        ]);
    }),

    http.post('*/rest/v1/products*', () => {
        return HttpResponse.json({ message: 'Success'}, {status: 201})
    }),

    http.delete('*/rest/v1/products*', () => {
        return new HttpResponse(null, {status: 204})
    })
];