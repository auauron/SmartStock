import { afterAll, beforeAll, expect } from "vitest";
import { TEST_USER_ID, testClient } from "./utils/db";
import { afterEach, describe, it } from "vitest";

// shared seed factory
const SEED = {
  base: () => ({
    user_id: TEST_USER_ID,
    name: "API Test Item",
    category: 'Electronics',
    price: 199.9,
    quantity: 10,
    min_stock: 3,
  }),
}

// helpers
async function createItem(overrides: Record<string, unknown> = {}) {
  const { data, error } = await testClient
    .from('inventories')
    .insert({...SEED.base(), ...overrides})
    .select()
    .single();

    if (error) throw new Error(`Seed failed: ${error.message}`);
    return data!;
}

async function deleteItemById(id: string) {
  await testClient.from('inventories').delete().eq('id', id);
}

// clean up guard (catches any rows that a failing test left behing)
afterAll(async () => {
  await testClient
    .from('inventories')
    .delete()
    .eq('user_id', TEST_USER_ID)
    .like('name', '%API Test%');
})

// Create
describe("POST /inventories - create", () => {
  let createdId: string;

  afterEach(async () => {
    if (createdId) await deleteItemById(createdId);
  })

  it('creates a row and returns the persisted data', async () => {
    const { data, error } = await testClient
      .from('inventories')
      .insert(SEED.base())
      .select()
      .single();

    expect(error).toBeNull();
    expect(data!.name).toBe(SEED.base().name);
    expect(data!.category).toBe(SEED.base().category);
    expect(data!.price).toBe(SEED.base().price);
    expect(data!.quantity).toBe(SEED.base().quantity);
    expect(data!.min_stock).toBe(SEED.base().min_stock);

    expect(data!.id).toBeTruthy();
    expect(data!.created_at).toBeTruthy();

    createdId = data!.id;
  })

  it("stores price with two-decimal precision", async () => {
    const { data, error } = await testClient
    .from('inventories')
    .insert({...SEED.base(), price: 99.95})
    .select()
    .single()

    expect(error).toBeNull();
    expect(data!.price).toBe(99.95);

    createdId = data!.id;
  })

  it("allows quantity = 0 (out-of-stock item can be tracked)", async () => {
    const { data, error } = await testClient
      .from("inventories")
      .insert({ ...SEED.base(), quantity: 0 })
      .select()
      .single();
 
    expect(error).toBeNull();
    expect(data!.quantity).toBe(0);
 
    createdId = data!.id;
  });
})

// Read 
describe('GET /inventories - read', () => {
  let item: Record<string, unknown>;

  beforeAll(async () => {
    item = await createItem();
  });

  afterAll(async() => {
    await deleteItemById(item.id as string);
  });

  it('fetches a single row by id with correct fields', async () => {
    const {data, error} = await testClient
      .from('inventories')
      .select('id, name, quantity, min_stock, price, category')
      .eq('id', item.id)
      .single();

    expect(error).toBeNull();
    expect(data!.id).toBe(item.id);
    expect(data!.name).toBe(SEED.base().name);
    expect(data!.quantity).toBe(SEED.base().quantity);
    expect(data!.min_stock).toBe(SEED.base().min_stock);
  })

  it("returns an array when listing all rows", async () => {
    const { data, error } = await testClient
      .from("inventories")
      .select("*")
      .eq("user_id", TEST_USER_ID);
 
    expect(error).toBeNull();
    // Must be an array even if empty
    expect(Array.isArray(data)).toBe(true);
    // Seeded item must appear in the list
    expect(data!.some((row) => row.id === item.id)).toBe(true);
  });

  it("returns empty array for a non-existent user_id", async () => {
    const { data, error } = await testClient
      .from("inventories")
      .select("*")
      .eq("user_id", "00000000-0000-0000-0000-000000000000");
 
    expect(error).toBeNull();
    expect(data).toHaveLength(0);
  });
})

// Update 
describe('PATCH /inventories - update', () => {
  let item: Record<string, unknown>;

  beforeAll(async () => {
    item = await createItem();
  });

  afterAll(async () => {
    await deleteItemById(item.id as string);
  });

  it("updates a single field (price) without affecting other fields", async () => {
    const { data, error } = await testClient
      .from("inventories")
      .update({ price: 299.99 })
      .eq("id", item.id)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data!.price).toBe(299.99);
    // Other fields must remain unchanged
    expect(data!.name).toBe(SEED.base().name);
    expect(data!.category).toBe(SEED.base().category);
    expect(data!.quantity).toBe(SEED.base().quantity);
  });

  it("updates quantity correctly", async () => {
    const { data, error } = await testClient
      .from("inventories")
      .update({ quantity: 50 })
      .eq("id", item.id)
      .select("quantity")
      .single();
 
    expect(error).toBeNull();
    expect(data!.quantity).toBe(50);
  });

  it("updates min_stock correctly", async () => {
    const { data, error } = await testClient
      .from("inventories")
      .update({ min_stock: 15 })
      .eq("id", item.id)
      .select("min_stock")
      .single();
 
    expect(error).toBeNull();
    expect(data!.min_stock).toBe(15);
  });

  it("updates multiple fields in one call", async () => {
    const { data, error } = await testClient
      .from("inventories")
      .update({ name: "API Test Item Updated", category: "Updated Category", price: 49.99 })
      .eq("id", item.id)
      .select()
      .single();
 
    expect(error).toBeNull();
    expect(data!.name).toBe("API Test Item Updated");
    expect(data!.category).toBe("Updated Category");
    expect(data!.price).toBe(49.99);
  });
})

// Delete 
describe("DELETE /inventories – delete", () => {
  it("deletes a row and confirms it no longer exists", async () => {
    const item = await createItem({ name: "API Test Item To Delete" });
 
    const { error: deleteError } = await testClient
      .from("inventories")
      .delete()
      .eq("id", item.id);
 
    expect(deleteError).toBeNull();
 
    // Second query must return zero rows 
    const { data: refetch } = await testClient
      .from("inventories")
      .select("id")
      .eq("id", item.id);
 
    expect(refetch).toHaveLength(0);
  });
});

// Validation
describe("Validation & DB constraints", () => {
  it("rejects insert when name is empty string", async () => {
    const { error } = await testClient.from("inventories").insert({
      ...SEED.base(),
      name: "",
    });
 
    expect(error).not.toBeNull();
  });
 
 
  it("rejects insert with negative price", async () => {
    const { error } = await testClient.from("inventories").insert({
      ...SEED.base(),
      name: "API Test Item Negative Price",
      price: -100,
    });
 
    expect(error).not.toBeNull();
  });
 
  it("rejects insert with negative quantity", async () => {
    const { error } = await testClient.from("inventories").insert({
      ...SEED.base(),
      name: "API Test Item Negative Qty",
      quantity: -1,
    });
 
    expect(error).not.toBeNull();
  });
 
  it("rejects insert with negative min_stock", async () => {
    const { error } = await testClient.from("inventories").insert({
      ...SEED.base(),
      name: "API Test Item Negative MinStock",
      min_stock: -1,
    });
 
    expect(error).not.toBeNull();
  });
});

// Ordering
describe("Ordering", () => {
  let ids: string[] = [];
 
  beforeAll(async () => {
    const items = await Promise.all([
      createItem({ name: "API Test Item Banana", price: 5,  quantity: 10 }),
      createItem({ name: "API Test Item Apple",  price: 15, quantity: 3  }),
      createItem({ name: "API Test Item Cherry", price: 8,  quantity: 20 }),
    ]);
    ids = items.map((i) => i.id);
  });
 
  afterAll(async () => {
    await Promise.all(ids.map(deleteItemById));
  });
 
  it("orders by name ascending", async () => {
    const { data, error } = await testClient
      .from("inventories")
      .select("name")
      .in("id", ids)
      .order("name", { ascending: true });
 
    expect(error).toBeNull();
    const names = data!.map((r) => r.name);
    expect(names).toEqual([...names].sort());
  });
 
  it("orders by name descending", async () => {
    const { data, error } = await testClient
      .from("inventories")
      .select("name")
      .in("id", ids)
      .order("name", { ascending: false });
 
    expect(error).toBeNull();
    const names = data!.map((r) => r.name);
    expect(names).toEqual([...names].sort().reverse());
  });
 
  it("orders by price ascending", async () => {
    const { data, error } = await testClient
      .from("inventories")
      .select("price")
      .in("id", ids)
      .order("price", { ascending: true });
 
    expect(error).toBeNull();
    const prices = data!.map((r) => r.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
 
  it("orders by created_at descending (newest first)", async () => {
    const { data, error } = await testClient
      .from("inventories")
      .select("id, created_at")
      .in("id", ids)
      .order("created_at", { ascending: false });
 
    expect(error).toBeNull();
    const timestamps = data!.map((r) => new Date(r.created_at).getTime());
    const sorted = [...timestamps].sort((a, b) => b - a);
    expect(timestamps).toEqual(sorted);
  });
});