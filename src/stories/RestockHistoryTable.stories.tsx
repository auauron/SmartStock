import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RestockHistoryTable } from "../components/restock/RestockHistoryTable";
import type { RestockEntry, RestockInventoryOption } from "../types";

const inventoryOptions: RestockInventoryOption[] = [
  { id: "inv-1", name: "USB-C Cable" },
  { id: "inv-2", name: "Desk Lamp" },
  { id: "inv-3", name: "Mechanical Keyboard" },
];

const rows: RestockEntry[] = [
  {
    id: "r-1",
    inventoryId: "inv-1",
    inventoryName: "USB-C Cable",
    quantityAdded: 40,
    date: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    notes: "Monthly supply refill.",
  },
  {
    id: "r-2",
    inventoryId: "inv-2",
    inventoryName: "Desk Lamp",
    quantityAdded: 10,
    date: new Date(Date.now() - 5 * 86_400_000).toISOString(),
    notes: "Top-up for sale week.",
  },
  {
    id: "r-3",
    inventoryId: "inv-3",
    inventoryName: "Mechanical Keyboard",
    quantityAdded: 6,
    date: new Date(Date.now() - 8 * 86_400_000).toISOString(),
    notes: "",
  },
];

const meta: Meta<typeof RestockHistoryTable> = {
  title: "Restock/RestockHistoryTable",
  component: RestockHistoryTable,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
        <Story />
      </div>
    ),
  ],
  args: {
    loading: false,
    inventory: inventoryOptions,
    dateFilter: "all",
    inventoryFilter: "",
    rows,
    totalItems: rows.length,
    currentPage: 1,
    itemsPerPage: 4,
    totalPages: 1,
    hasNoResults: false,
  },
  render: (args) => {
    const [dateFilter, setDateFilter] = useState(args.dateFilter);
    const [inventoryFilter, setInventoryFilter] = useState(
      args.inventoryFilter,
    );
    const [currentPage, setCurrentPage] = useState(args.currentPage);

    return (
      <RestockHistoryTable
        {...args}
        dateFilter={dateFilter}
        inventoryFilter={inventoryFilter}
        currentPage={currentPage}
        onDateFilterChange={setDateFilter}
        onInventoryFilterChange={setInventoryFilter}
        onPageChange={setCurrentPage}
      />
    );
  },
};

export default meta;
type Story = StoryObj<typeof RestockHistoryTable>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const EmptyState: Story = {
  args: {
    rows: [],
    totalItems: 0,
    hasNoResults: true,
  },
};

export const WithPagination: Story = {
  args: {
    totalItems: 16,
    totalPages: 4,
    currentPage: 2,
  },
};

export const FilteredNoResults: Story = {
  args: {
    inventoryFilter: "Desk Lamp",
    rows: [],
    totalItems: 0,
    hasNoResults: true,
  },
};
