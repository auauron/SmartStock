import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { testClient, clearDatabase } from "./utils/db";

const TEST_USER_ID = "11111111-1111-1111-1111-111111111111";

let createdInventoryId: string;

beforeAll(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
});

describe("Inventory API", () => {
  it("POST inventories - should create a new inventory row", async () => {
    const { data, error } = await testClient
      .from("inventories")
      .insert({
        user_id: TEST_USER_ID,
        name: "Inventory API Test Item",
        category: "Electronics",
        price: 199.99,
        quantity: 10,
        min_stock: 3,
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data!.name).toBe("Inventory API Test Item");
    expect(data!.category).toBe("Electronics");
    expect(data!.price).toBe(199.99);

    createdInventoryId = data!.id;
  });

  it("GET inventories by ID - should fetch the created inventory", async () => {
    const { data, error } = await testClient
      .from("inventories")
      .select("id, name, quantity, min_stock")
      .eq("id", createdInventoryId)
      .single();

    expect(error).toBeNull();
    expect(data!.id).toBe(createdInventoryId);
    expect(data!.name).toBe("Inventory API Test Item");
    expect(data!.quantity).toBe(10);
  });

  it("GET inventories - should list inventory rows as an array", async () => {
    const { data, error } = await testClient.from("inventories").select("*");

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data!.length).toBeGreaterThan(0);
  });

  it("DELETE inventories - should delete the created inventory row", async () => {
    const { error } = await testClient
      .from("inventories")
      .delete()
      .eq("id", createdInventoryId);

    expect(error).toBeNull();

    const { data } = await testClient
      .from("inventories")
      .select("id")
      .eq("id", createdInventoryId);

    expect(data).toHaveLength(0);
  });
});
