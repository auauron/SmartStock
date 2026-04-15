import { vi, describe, it, expect, beforeEach } from "vitest";
import {
  getRestockInventory,
  getRestockHistory,
  createRestock,
} from "../services/restockService";
import { supabase } from "../lib/supabaseClient";

vi.mock("../lib/supabaseClient", () => {
  return {
    supabase: {
      auth: {
        getUser: vi.fn(),
      },
      from: vi.fn(),
      rpc: vi.fn(),
    },
  };
});

describe("restockService", () => {
  const mockUserId = "test-user-id";
  const mockUser = { id: mockUserId };

  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
  });

  describe("getRestockInventory", () => {
    it("should throw an error if user is not signed in", async () => {
      (supabase.auth.getUser as any).mockResolvedValue({
        data: { user: null },
        error: new Error("Not auth"),
      });
      await expect(getRestockInventory()).rejects.toThrow(
        "You must be signed in to manage restocks."
      );
    });

    it("should throw an error if supabase from() inventory fetch fails", async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: null,
              error: new Error("Db error"),
            }),
          }),
        }),
      });
      (supabase as any).from = mockFrom;

      await expect(getRestockInventory()).rejects.toThrow("Db error");
    });

    it("should return mapped inventory successfully", async () => {
      const mockData = [
        { id: "1", name: "Item A" },
        { id: "2", name: "Item B" },
      ];

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });
      (supabase as any).from = mockFrom;

      const result = await getRestockInventory();
      expect(result).toEqual([
        { id: "1", name: "Item A" },
        { id: "2", name: "Item B" },
      ]);
      expect(mockFrom).toHaveBeenCalledWith("inventories");
    });
  });

  describe("getRestockHistory", () => {
    it("should throw an error if fetch fails", async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: null,
              error: new Error("Db error history"),
            }),
          }),
        }),
      });
      (supabase as any).from = mockFrom;

      await expect(getRestockHistory()).rejects.toThrow("Db error history");
    });

    it("should return mapped history successfully", async () => {
      const mockData = [
        {
          id: "1",
          quantity_added: 10,
          notes: "Test notes",
          restocked_at: "2026-04-03T00:00:00.000Z",
          inventories: { name: "Item Foo" },
        },
        {
          id: "2",
          quantity_added: 5,
          notes: null,
          restocked_at: "2026-04-02T00:00:00.000Z",
          inventories: [{ name: "Item Bar" }],
        },
      ];

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });
      (supabase as any).from = mockFrom;

      const result = await getRestockHistory();
      expect(result).toEqual([
        {
          id: "1",
          inventoryName: "Item Foo",
          quantityAdded: 10,
          date: "2026-04-03T00:00:00.000Z",
          notes: "Test notes",
        },
        {
          id: "2",
          inventoryName: "Item Bar",
          quantityAdded: 5,
          date: "2026-04-02T00:00:00.000Z",
          notes: "",
        },
      ]);
      expect(mockFrom).toHaveBeenCalledWith("restocks");
    });
  });

  describe("createRestock", () => {
    it("should throw an error if rpc fails", async () => {
      (supabase as any).rpc = vi.fn().mockResolvedValue({
        data: null,
        error: new Error("RPC error"),
      });

      await expect(
        createRestock({ inventoryId: "1", quantityAdded: 10, notes: "err notes" })
      ).rejects.toThrow("RPC error");
    });

    it("should throw an error if no restock entry returned", async () => {
      (supabase as any).rpc = vi
        .fn()
        .mockResolvedValue({ data: [], error: null });

      await expect(
        createRestock({ inventoryId: "1", quantityAdded: 10, notes: "err notes" })
      ).rejects.toThrow("Failed to create restock entry.");
    });

    it("should create restock and return mapped data", async () => {
      const mockRpcData = [
        {
          id: "10",
          inventory_name: "Item Baz",
          quantity_added: 20,
          notes: "some notes",
          restocked_at: "2026-04-03T12:00:00.000Z",
        },
      ];

      const mockRpc = vi
        .fn()
        .mockResolvedValue({ data: mockRpcData, error: null });
      (supabase as any).rpc = mockRpc;

      const input = {
        inventoryId: "99",
        quantityAdded: 20,
        notes: "some notes",
      };
      const result = await createRestock(input);

      expect(mockRpc).toHaveBeenCalledWith("create_restock_transaction", {
        p_inventory_id: "99",
        p_quantity_added: 20,
        p_notes: "some notes",
      });

      expect(result).toEqual({
        id: "10",
        inventoryName: "Item Baz",
        quantityAdded: 20,
        date: "2026-04-03T12:00:00.000Z",
        notes: "some notes",
      });
    });
  });
});
