import { Meta, StoryObj } from "@storybook/react-vite";
import { LowStockList } from "../components/dashboard/LowStockList";
import { Inventory } from "../types";

const mockItems: Inventory[] = [
        { id: "1", name: "Laptop", category: "Electronics", price: 45000, quantity: 2, minStock: 5 },
        { id: "2", name: "Monitor", category: "Electronics", price: 20000, quantity: 1, minStock: 3 },

]


const meta: Meta<typeof LowStockList> = {
    title: "Dashboard/LowStockList",
    component: LowStockList,
};

export default meta;

export const Default: StoryObj<typeof LowStockList> = {
    args: {
        loading: false,
        items: mockItems,
    },
};

export const Empty: StoryObj<typeof LowStockList> = {
    args: {
        loading: false,
        items: [],
    }
}

export const Loading: StoryObj<typeof LowStockList> = {
    args: {
        loading: true,
        items: [],
    }
}