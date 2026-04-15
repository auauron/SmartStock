import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { testClient, clearDatabase } from "./utils/db";

const TEST_USER_ID = "11111111-1111-1111-1111-111111111111";

let createdInventoryId: string;
let createdRestockId: string;

beforeAll(async () => {
  await clearDatabase();

  const { data, error } = await testClient
    .from("inventories")
    .insert({
      user_id: TEST_USER_ID,
      name: "Test Item (API)",
      category: "Electronics",
      price: 99.99,
      quantity: 0,
      min_stock: 5,
    })
    .select()
    .single();

  if (error) throw new Error(`beforeAll seed failed: ${error.message}`);
  createdInventoryId = data.id;
});

afterAll(async () => {
  await clearDatabase();
});


describe("Restocks API", () => {
  it("POST restocks — should create a new restock row frfr", async () => {
    const { data, error } = await testClient
      .from("restocks")
      .insert({
        inventory_id: createdInventoryId,
        user_id: TEST_USER_ID,
        quantity_added: 20,
        notes: "API integration test restock",
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data!.quantity_added).toBe(20);
    expect(data!.notes).toBe("API integration test restock");
    expect(data!.inventory_id).toBe(createdInventoryId);

    createdRestockId = data!.id;
  });

  it("GET restocks by ID — should fetch the created restock", async () => {
    // Arrange & Act
    const { data, error } = await testClient
      .from("restocks")
      .select("id, quantity_added, notes")
      .eq("id", createdRestockId)
      .single();

    // Assert
    expect(error).toBeNull();
    expect(data!.id).toBe(createdRestockId);
    expect(data!.quantity_added).toBe(20);
  });

  it("GET restocks — should list all restocks as an array", async () => {
    // Arrange & Act
    const { data, error } = await testClient
      .from("restocks")
      .select("*");

    // Assert
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data!.length).toBeGreaterThan(0);
  });

  it("DELETE restocks — should delete the restock row", async () => {
    // Arrange & Act
    const { error } = await testClient
      .from("restocks")
      .delete()
      .eq("id", createdRestockId);

    // Assert — no error means successful delete
    expect(error).toBeNull();

    // Verify it's gone
    const { data } = await testClient
      .from("restocks")
      .select("id")
      .eq("id", createdRestockId);

    expect(data).toHaveLength(0);
  });
});
