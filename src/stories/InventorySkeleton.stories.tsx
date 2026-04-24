import { Meta, StoryObj } from "@storybook/react-vite";
import { InventorySkeleton } from "../components/inventory/InventorySkeleton";


const meta: Meta<typeof InventorySkeleton> = {
    title: "Inventory/InventorySkeleton",
    component: InventorySkeleton,
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div className="p-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-left text-gray-500 border-b">
                            <th className="px-6 py-3">Item Name</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Stock</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <Story />
                    </tbody>
                </table>
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof InventorySkeleton>;

export const Default: Story = {
    args: {
        rows: 5,
    },
};

export const SingleRow: Story = {
    args: {
        rows: 1,
    },
};