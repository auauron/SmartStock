import { Meta, StoryObj } from "@storybook/react-vite";
import { InventoryTable } from "../components/inventory/InventoryTable";


const meta: Meta<typeof InventoryTable> = {
    title: "Inventory/InventoryTable",
    component: InventoryTable,
    args: {
        items: [
            { id: "1", name: "Laptop", category: "Electronics", price: 999, quantity: 10, minStock: 5},
            { id: "2", name: "Desk Chair", category: "Furniture", price: 150, quantity: 2, minStock: 5},
        ],
        loading: false,
        currentPage: 1,
        totalPages: 1,
    },
};

export default meta;
type Story = StoryObj<typeof InventoryTable>;

export const Default: Story = {};

export const Loading: Story = {
    args: {
        loading: true,
    },
};

export const Empty: Story = {
    args: {
        items: [],
    },
};
