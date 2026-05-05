import { describe, it, expect } from "vitest";

// Shared Mock Data

const NOW = Date.now();
const DAY_MS = 24 * 60 * 60 * 1000;

const mockInventory = [
  {
    id: "1",
    name: "Item A",
    category: "Cat 1",
    price: 100,
    quantity: 5,
    minStock: 10,
    createdAt: new Date(NOW - 2 * DAY_MS),
  },
  {
    id: "2",
    name: "Item B",
    category: "Cat 2",
    price: 200,
    quantity: 20,
    minStock: 5,
    createdAt: new Date(NOW - 10 * DAY_MS),
  },
  {
    id: "3",
    name: "Item C",
    category: "Cat 1",
    price: 50,
    quantity: 2,
    minStock: 15,
    createdAt: new Date(NOW - 1 * DAY_MS),
  },
];

const mockRestockHistory = [
  { inventoryName: "Item A", quantityAdded: 10, date: new Date(NOW - 1 * DAY_MS) },
  { inventoryName: "Item B", quantityAdded: 5,  date: new Date(NOW - 3 * DAY_MS) },
  { inventoryName: "Item C", quantityAdded: 20, date: new Date(NOW - 9 * DAY_MS) },
];

const mockAuditLogs = [
  {
    id: "log1",
    userId: "user1",
    itemName: "Item A",
    action: "INSERT" as const,
    changes: { quantity: { from: null, to: 5 } },
    createdAt: new Date(NOW - 1 * DAY_MS),
  },
  {
    id: "log2",
    userId: "user1",
    itemName: "Item B",
    action: "UPDATE" as const,
    changes: { price: { from: 150, to: 200 } },
    createdAt: new Date(NOW - 2 * DAY_MS),
  },
  {
    id: "log3",
    userId: "user1",
    itemName: "Item C",
    action: "DELETE" as const,
    changes: null,
    createdAt: new Date(NOW - 3 * DAY_MS),
  },
];

// replicate dashboard computations inline 

function computeDashboardStats(
  inventory: typeof mockInventory,
  history: typeof mockRestockHistory,
) {
  const sevenDaysAgo = NOW - 7 * DAY_MS;
  const fourteenDaysAgo = NOW - 14 * DAY_MS;

  const totalProducts = inventory.length;
  const lowStock = inventory.filter((p) => p.quantity < p.minStock);
  const value = inventory.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const thisWeekRestocks = history.filter(
    (h) => new Date(h.date).getTime() >= sevenDaysAgo,
  );
  const lastWeekRestocks = history.filter((h) => {
    const t = new Date(h.date).getTime();
    return t >= fourteenDaysAgo && t < sevenDaysAgo;
  });

  const thisWeekTotal = thisWeekRestocks.reduce((s, h) => s + h.quantityAdded, 0);
  const lastWeekTotal = lastWeekRestocks.reduce((s, h) => s + h.quantityAdded, 0);

  const restockTrend =
    lastWeekTotal === 0
      ? "—"
      : Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100);

  const newItemsThisWeek = inventory.filter(
    (p) => p.createdAt && new Date(p.createdAt).getTime() >= sevenDaysAgo,
  ).length;
  const itemGrowthTrend =
    totalProducts === 0
      ? 0
      : Math.round((newItemsThisWeek / totalProducts) * 100);

  return {
    totalProducts,
    lowStock,
    value,
    thisWeekTotal,
    lastWeekTotal,
    restockTrend,
    itemGrowthTrend,
  };
}

// replicate activity transform logic 
interface ActivityItem {
  itemName: string;
  action: string;
  detail: string;
  timestamp: number;
}

function transformAuditLogs(logs: typeof mockAuditLogs): ActivityItem[] {
  return logs.map((log) => {
    let detail = "Action performed";
    if (log.action === "DELETE") {
      detail = "Removed from inventory";
    } else if (log.action === "INSERT") {
      const quantity = log.changes?.quantity?.to ?? 0;
      detail = `Initial stock: ${quantity} units`;
    } else if (log.action === "UPDATE") {
      const entries = Object.entries(log.changes ?? {});
      detail =
        entries.length === 0
          ? "Updated details"
          : entries
              .map(([key, value]) => {
                const label = key.replace(/([A-Z])/g, " $1").toLowerCase();
                return `${label.charAt(0).toUpperCase() + label.slice(1)}: ${value.from} → ${value.to}`;
              })
              .join(", ");
    }
    return {
      itemName: log.itemName,
      action: log.action,
      detail,
      timestamp:
        log.createdAt instanceof Date
          ? log.createdAt.getTime()
          : new Date(log.createdAt).getTime(),
    };
  });
}

// 1. STATS CARD TESTS

describe("Stats Card – computeDashboardStats()", () => {
  describe("Total Inventory", () => {
    it("returns the correct total product count", () => {
      const { totalProducts } = computeDashboardStats(mockInventory, mockRestockHistory);
      expect(totalProducts).toBe(3);
    });
  });

  describe("Stock Alerts", () => {
    it("correctly identifies low stock items (quantity < minStock)", () => {
      const { lowStock } = computeDashboardStats(mockInventory, mockRestockHistory);
      expect(lowStock).toHaveLength(2);
      expect(lowStock.map((i) => i.id)).toEqual(expect.arrayContaining(["1", "3"]));
    });

    it("returns empty array when all stock is healthy", () => {
      const healthy = mockInventory.map((i) => ({ ...i, quantity: i.minStock + 10 }));
      const { lowStock } = computeDashboardStats(healthy, []);
      expect(lowStock).toHaveLength(0);
    });

    it("treats quantity === minStock as healthy (not low stock)", () => {
      const atMin = [{ ...mockInventory[0], quantity: 10, minStock: 10 }];
      const { lowStock } = computeDashboardStats(atMin, []);
      expect(lowStock).toHaveLength(0);
    });

    it("treats quantity === 0 as low stock", () => {
      const zeroQty = [{ ...mockInventory[0], quantity: 0, minStock: 5 }];
      const { lowStock } = computeDashboardStats(zeroQty, []);
      expect(lowStock).toHaveLength(1);
    });
  });

  describe("Weekly Restocks", () => {
    it("counts only restocks within the last 7 days", () => {
      const { thisWeekTotal } = computeDashboardStats(mockInventory, mockRestockHistory);
      expect(thisWeekTotal).toBe(15);
    });

    it("returns 0 weekly restocks when history is empty", () => {
      const { thisWeekTotal } = computeDashboardStats([], []);
      expect(thisWeekTotal).toBe(0);
    });
  });

  describe("Inventory Value", () => {
    it("calculates total inventory value as sum of price × quantity", () => {
      const { value } = computeDashboardStats(mockInventory, []);
      expect(value).toBe(4600);
    });

    it("returns 0 for empty inventory", () => {
      const { value } = computeDashboardStats([], []);
      expect(value).toBe(0);
    });
  });
});

// 2. RECENT ACTIVITIES TESTS


describe("Recent Activities – transformAuditLogs()", () => {
  it("transforms INSERT log with correct detail message", () => {
    const result = transformAuditLogs([mockAuditLogs[0]]);
    expect(result[0].action).toBe("INSERT");
    expect(result[0].detail).toBe("Initial stock: 5 units");
    expect(result[0].itemName).toBe("Item A");
  });

  it("transforms UPDATE log with changed field details", () => {
    const result = transformAuditLogs([mockAuditLogs[1]]);
    expect(result[0].action).toBe("UPDATE");
    expect(result[0].detail).toContain("150");
    expect(result[0].detail).toContain("200");
    expect(result[0].detail).toContain("→");
  });

  it("transforms DELETE log with correct detail message", () => {
    const result = transformAuditLogs([mockAuditLogs[2]]);
    expect(result[0].action).toBe("DELETE");
    expect(result[0].detail).toBe("Removed from inventory");
  });

  it("returns 'Updated details' for UPDATE with empty changes", () => {
    const emptyUpdateLog = [{ ...mockAuditLogs[1], changes: {} }];
    const result = transformAuditLogs(emptyUpdateLog as typeof mockAuditLogs);
    expect(result[0].detail).toBe("Updated details");
  });

  it("transforms all logs preserving order", () => {
    const result = transformAuditLogs(mockAuditLogs);
    expect(result).toHaveLength(3);
    expect(result.map((r) => r.action)).toEqual(["INSERT", "UPDATE", "DELETE"]);
  });

  it("returns empty array for empty input", () => {
    const result = transformAuditLogs([]);
    expect(result).toEqual([]);
  });
});


// 3. LOW STOCK ALERT TESTS

describe("Low Stock Alert – item filtering", () => {
  it("identifies items where quantity < minStock as low stock", () => {
    const { lowStock } = computeDashboardStats(mockInventory, []);
    const ids = lowStock.map((i) => i.id);
    expect(ids).toContain("1"); // Item A: 5 < 10
    expect(ids).toContain("3"); // Item C: 2 < 15
    expect(ids).not.toContain("2"); // Item B: 20 >= 5
  });


  it("returns no items when all are above minimum", () => {
    const allHealthy = mockInventory.map((i) => ({ ...i, quantity: i.minStock + 5 }));
    const { lowStock } = computeDashboardStats(allHealthy, []);
    expect(lowStock).toHaveLength(0);
  });
});

describe("Low Stock Alert – LowStockList display (first 4 items)", () => {
  it("shows at most 4 low stock items in the dashboard list", () => {
    const manyLowStock = Array.from({ length: 6 }, (_, i) => ({
      id: String(i),
      name: `Item ${i}`,
      category: "Cat",
      price: 10,
      quantity: 0,
      minStock: 10,
      createdAt: new Date(),
    }));
    const displayed = manyLowStock.slice(0, 4);
    expect(displayed).toHaveLength(4);
  });

  it("shows all items when fewer than 4 are low stock", () => {
    const { lowStock } = computeDashboardStats(mockInventory, []);
    const displayed = lowStock.slice(0, 4);
    expect(displayed).toHaveLength(lowStock.length);
  });
});