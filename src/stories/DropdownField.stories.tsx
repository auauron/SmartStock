import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Package } from "lucide-react";
import { DropdownField } from "../components/ui/DropdownField";

const meta: Meta<typeof DropdownField> = {
  title: "UI-Components/DropdownField",
  component: DropdownField,
  parameters: {
    layout: "centered",
  },
  args: {
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof DropdownField>;

export const Default: Story = {
  args: {
    id: "dropdown-default",
    label: "Category",
    children: (
      <>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="food">Food & Beverage</option>
        <option value="tools">Tools & Hardware</option>
      </>
    ),
  },
};

export const WithPreselectedValue: Story = {
  args: {
    id: "dropdown-preselected",
    label: "Category",
    defaultValue: "clothing",
    children: (
      <>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="food">Food & Beverage</option>
        <option value="tools">Tools & Hardware</option>
      </>
    ),
  },
};

export const WithIcon: Story = {
  args: {
    id: "dropdown-icon",
    label: "Product",
    icon: Package,
    children: (
      <>
        <option value="mouse">Wireless Mouse</option>
        <option value="keyboard">Mechanical Keyboard</option>
        <option value="monitor">4K Monitor</option>
      </>
    ),
  },
};

export const WithDisabledOption: Story = {
  args: {
    id: "dropdown-disabled-option",
    label: "Stock Status",
    children: (
      <>
        <option value="in-stock">In Stock</option>
        <option value="low-stock">Low Stock</option>
        <option value="out-of-stock" disabled>
          Out of Stock (unavailable)
        </option>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    id: "dropdown-disabled",
    label: "Category",
    disabled: true,
    defaultValue: "electronics",
    children: (
      <>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </>
    ),
  },
};
