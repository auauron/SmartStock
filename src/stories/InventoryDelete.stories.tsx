import { Meta, StoryObj } from "@storybook/react-vite";
import { DeleteConfirmationModal } from "../components/inventory/InventoryDeleteModal";
import { useState } from "react";

const meta: Meta<typeof DeleteConfirmationModal> = {
  title: "Inventory/InventoryDeleteConfirmationModal",
  component: DeleteConfirmationModal,
  tags: ["autodocs"],
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <DeleteConfirmationModal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    );
  },
};

export default meta;
type Story = StoryObj<typeof DeleteConfirmationModal>;

export const Default: Story = {
  args: {
    title: "Delete Item",
    message:
      "Are you sure you want to delete this item? This action cannot be undone.",
    onConfirm: async () => {
      console.log("Confirmed deletion");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    },
  },
};

export const WithItemName: Story = {
  args: {
    title: "Delete Item",
    itemName: "Ergonomic Office Chair",
    onConfirm: () => console.log("Deleted item"),
  },
};
