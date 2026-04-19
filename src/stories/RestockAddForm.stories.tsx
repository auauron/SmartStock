import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  RestockAddForm,
  type RestockFormData,
} from "../components/restock/RestockAddForm";
import type { RestockInventoryOption } from "../types";

const inventoryOptions: RestockInventoryOption[] = [
  { id: "inv-1", name: "USB-C Cable" },
  { id: "inv-2", name: "Desk Lamp" },
  { id: "inv-3", name: "Mechanical Keyboard" },
];

const meta: Meta<typeof RestockAddForm> = {
  title: "Restock/RestockAddForm",
  component: RestockAddForm,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
        <Story />
      </div>
    ),
  ],
  args: {
    formKey: 0,
    formData: {
      inventoryId: "",
      quantity: "",
      notes: "",
    },
    inventory: inventoryOptions,
    loading: false,
    submitting: false,
    errorMessage: "",
    onDismissError: () => console.log("dismiss error"),
    onSubmit: (e) => {
      e.preventDefault();
      console.log("submit restock form");
    },
  },
  render: (args) => {
    const [formData, setFormData] = useState<RestockFormData>(args.formData);

    return (
      <RestockAddForm
        {...args}
        formData={formData}
        onInventoryChange={(value) => {
          setFormData((prev) => ({ ...prev, inventoryId: value }));
        }}
        onQuantityChange={(value) => {
          setFormData((prev) => ({ ...prev, quantity: value }));
        }}
        onNotesChange={(value) => {
          setFormData((prev) => ({ ...prev, notes: value }));
        }}
      />
    );
  },
};

export default meta;
type Story = StoryObj<typeof RestockAddForm>;

export const Default: Story = {};

export const WithValues: Story = {
  args: {
    formData: {
      inventoryId: "inv-2",
      quantity: "12",
      notes: "Supplier delivered early.",
    },
  },
};

export const Submitting: Story = {
  args: {
    submitting: true,
    formData: {
      inventoryId: "inv-1",
      quantity: "5",
      notes: "Preparing stockroom placement.",
    },
  },
};

export const LoadingInventory: Story = {
  args: {
    loading: true,
    inventory: [],
  },
};

export const EmptyInventory: Story = {
  args: {
    inventory: [],
  },
};

export const ErrorState: Story = {
  args: {
    errorMessage: "Please select an item before adding a restock entry.",
  },
};
