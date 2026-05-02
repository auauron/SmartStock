import { describe, it, expect, beforeAll } from "vitest";
import { testClient, TEST_USER_ID } from "./utils/db";

let createdInventoryId: string;
let createdRestockId: string;

beforeAll(async () => {
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

  describe("Business Rules & Data Integrity", () => {
    it("SYNC - should increase inventory quantity when a restock is added", async () => {
      // 1. Get current quantity
      const { data: before } = await testClient
        .from("inventories")
        .select("quantity")
        .eq("id", createdInventoryId)
        .single();

      const initialQty = before!.quantity;

      // 2. Add restock using the RPC transaction (the correct app logic)
      const { error: rpcError } = await testClient.rpc("create_restock_transaction", {
        p_inventory_id: createdInventoryId,
        p_quantity_added: 50,
        p_notes: "Testing stock sync via RPC"
      });
      expect(rpcError).toBeNull();

      // 3. Verify inventory quantity increased
      const { data: after } = await testClient
        .from("inventories")
        .select("quantity")
        .eq("id", createdInventoryId)
        .single();

      expect(after!.quantity).toBe(initialQty + 50);
    });

    it("CASCADE - should delete restocks when parent inventory is deleted", async () => {
      // 1. Create a temporary valid inventory item with a restock
      const { data: tempInv, error: invError } = await testClient.from("inventories").insert({
        user_id: TEST_USER_ID,
        name: "Temporary Item",
        category: "Test",
        price: 10,
        quantity: 0
      }).select().single();
      
      expect(invError).toBeNull();

      const { data: tempRestock, error: restockError } = await testClient.from("restocks").insert({
        inventory_id: tempInv!.id,
        user_id: TEST_USER_ID,
        quantity_added: 10
      }).select().single();
      
      expect(restockError).toBeNull();

      // 2. Delete inventory
      await testClient.from("inventories").delete().eq("id", tempInv!.id);

      // 3. Verify restock is gone
      const { data: orphanedRestocks } = await testClient
        .from("restocks")
        .select("id")
        .eq("id", tempRestock!.id);

      expect(orphanedRestocks).toHaveLength(0);
    });
  });

  describe("Sad Paths & Error Handling", () => {
    it("POST restocks - should fail with negative quantity", async () => {
      const { error } = await testClient
        .from("restocks")
        .insert({
          inventory_id: createdInventoryId,
          user_id: TEST_USER_ID,
          quantity_added: -50,
          notes: "Negative restock test"
        });

      expect(error).not.toBeNull();
      // Accepts check constraint OR RLS error (which Supabase sometimes throws for invalid rows)
      expect(error!.message).toMatch(/(check|row-level security)/i);
    });

    it("POST restocks - should fail for non-existent inventory ID", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      const { error } = await testClient
        .from("restocks")
        .insert({
          inventory_id: fakeId,
          user_id: TEST_USER_ID,
          quantity_added: 10
        });

      expect(error).not.toBeNull();
      // Code 42501 is RLS Insufficient Privilege, 23503 is FK violation
      expect(["42501", "23503"]).toContain(error!.code);
    });

    it("POST restocks - should fail if inventory_id is missing", async () => {
      const { error } = await testClient
        .from("restocks")
        .insert({
          user_id: TEST_USER_ID,
          quantity_added: 10
        });

      expect(error).not.toBeNull();
      // Should hit RLS or Not Null constraint
      expect(["42501", "23502"]).toContain(error!.code);
    });
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
