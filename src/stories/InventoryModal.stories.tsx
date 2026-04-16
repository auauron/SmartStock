import type { Meta, StoryObj } from "@storybook/react-vite";
import { InventoryModal } from "../components/inventory/InventoryModal";

const meta: Meta<typeof InventoryModal> = {
  title: "Inventory/InventoryModal",
  component: InventoryModal,
  tags: ["autodocs"],
  args: {
    onClose: () => console.log("Close button clicked"),
    onSave: async (data) => {
      console.log("Saved inventory data:", data);
    },
  },
};

export default meta;
type Story = StoryObj<typeof InventoryModal>;

export const AddNewItem: Story = {
  args: {
    isOpen: true,
  },
};

export const EditItem: Story = {
  args: {
    isOpen: true,
    item: {
      id: "inv_12345",
      name: "Ergonomic Office Chair",
      category: "Furniture",
      price: 199.99,
      quantity: 45,
      minStock: 10,
    },
  },
};

// TODO: implement restock story — track in issue tracker (e.g. ISSUE-001)
// TODO: implement delete story — track in issue tracker (e.g. ISSUE-002)
// TODO: implement filter categories story — track in issue tracker (e.g. ISSUE-003)
// TODO: implement search inventory item story — track in issue tracker (e.g. ISSUE-004)
