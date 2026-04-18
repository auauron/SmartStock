import type { Meta, StoryObj } from "@storybook/react-vite";
import { BrowserRouter } from "react-router-dom";
import { RestockIntelligence } from "../components/dashboard/analytics/RestockIntelligence";
import type { Inventory, RestockEntry } from "../types";

const mockInventory: Inventory[] = [
  {
    id: "1",
    name: "Tactical Mouse",
    category: "Electronics",
    price: 45,
    quantity: 5,
    minStock: 10,
  },
  {
    id: "2",
    name: "Glass Desk",
    category: "Furniture",
    price: 250,
    quantity: 12,
    minStock: 10,
  },
  {
    id: "3",
    name: "Industrial Keyboard",
    category: "Electronics",
    price: 85,
    quantity: 2,
    minStock: 15,
  },
  {
    id: "4",
    name: "RGB Mat",
    category: "Accessories",
    price: 25,
    quantity: 8,
    minStock: 5,
  },
  {
    id: "5",
    name: "USB-C Cable",
    category: "Electronics",
    price: 15,
    quantity: 20,
    minStock: 40,
  },
  {
    id: "6",
    name: "Power Bank",
    category: "Electronics",
    price: 40,
    quantity: 3,
    minStock: 20,
  },
];

const mockHistory: RestockEntry[] = [
  {
    id: "h1",
    inventoryId: "1",
    inventoryName: "Tactical Mouse",
    quantityAdded: 10,
    date: new Date(Date.now() - 10 * 86400000).toISOString(),
    notes: "Regular restock",
  },
  {
    id: "h2",
    inventoryId: "3",
    inventoryName: "Industrial Keyboard",
    quantityAdded: 15,
    date: new Date(Date.now() - 20 * 86400000).toISOString(),
    notes: "Bulk order",
  },
];

const meta: Meta<typeof RestockIntelligence> = {
  title: "Restock/RestockIntelligence",
  component: RestockIntelligence,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  args: {
    inventory: mockInventory,
    history: mockHistory,
    loading: false,
  },
};

export default meta;
type Story = StoryObj<typeof RestockIntelligence>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    inventory: [],
    history: [],
  },
};

export const Healthy: Story = {
  args: {
    inventory: [
      {
        id: "7",
        name: "Healthy Item",
        category: "General",
        price: 10,
        quantity: 100,
        minStock: 10,
      },
    ],
    history: [],
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};
