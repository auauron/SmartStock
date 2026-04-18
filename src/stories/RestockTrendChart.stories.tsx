import type { Meta, StoryObj } from "@storybook/react-vite";
import { RestockTrendChart } from "../components/dashboard/analytics/RestockTrendChart";
import type { RestockEntry } from "../types";

const mockHistory: RestockEntry[] = [
  {
    id: "1",
    inventoryId: "inv1",
    inventoryName: "Item A",
    quantityAdded: 50,
    date: new Date().toISOString(),
    notes: "",
  },
  {
    id: "2",
    inventoryId: "inv2",
    inventoryName: "Item B",
    quantityAdded: 30,
    date: new Date(Date.now() - 86400000).toISOString(),
    notes: "",
  },
  {
    id: "3",
    inventoryId: "inv1",
    inventoryName: "Item A",
    quantityAdded: 45,
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    notes: "",
  },
  {
    id: "4",
    inventoryId: "inv3",
    inventoryName: "Item C",
    quantityAdded: 100,
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
    notes: "",
  },
];

const meta: Meta<typeof RestockTrendChart> = {
  title: "Dashboard/RestockTrendChart",
  component: RestockTrendChart,
  decorators: [
    (Story) => (
      <div className="max-w-3xl mx-auto p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    history: mockHistory,
    loading: false,
  },
};

export default meta;
type Story = StoryObj<typeof RestockTrendChart>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    history: [],
  },
};
