import { http, HttpResponse} from 'msw';


export const handlers = [
    http.get('*/auth/v1/user', () => { 
        return HttpResponse.json({
            data: {
                user: { id: 'test-user-123', email: 'test@example.com' },
            },
            error: null
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