import { ProductServiceProxy } from "../services/productsService";
import { describe, it, expect, beforeAll } from "vitest";
import { clearDatabase, testClient } from "./utils/db";


describe("Product Service Integration", () => {
    const service = new ProductServiceProxy();

    let createdProductId: string;

    beforeAll(async () => {
        await clearDatabase();
    })

    it('Should save a product and return the database-generated ID', async () => {
        const newProduct = {
            name: "Integration Keyboard",
            category: "Electronics",
            price: 150,
            quantity: 5,
            minStock: 2,
        };
        const savedProduct = await service.saveProduct(newProduct);

        expect(savedProduct.id).toBeDefined();
        expect(typeof savedProduct.id).toBe('string');
        expect(savedProduct.name).toBe('Integration Keyboard');

        createdProductId = savedProduct.id;
    })

    it('Should fetch the products including the one that was just saved', async () => {
        const products = await service.getProducts();

        expect(Array.isArray(products)).toBe(true);
        const found = products.find(p => p.id === createdProductId);

        expect(found).toBeDefined();
        expect(found?.name).toBe('Integration Keyboard');
        expect(found).toHaveProperty('minStock');
    })

    it('Should update the existing product', async () => {
        const updateData = {
            id: createdProductId,
            name: 'Updated Keyboard',
            category: 'Electronics',
            price: 175,
            quantity: 3,
            minStock: 1,
        }

        const updatedProduct = await service.saveProduct(updateData);

        expect(updatedProduct.id).toBe(createdProductId);
        expect(updatedProduct.name).toBe("Updated Keyboard");
        expect(updatedProduct.price).toBe(175);
    })

    it('Should delete the product correctly', async () => {
        await service.deleteProduct(createdProductId)

        const { data } = await testClient
            .from('products')
            .select('id')
            .eq('id', createdProductId);

        expect(data).toHaveLength(0);
    })
})


