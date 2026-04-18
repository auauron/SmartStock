import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail } from "lucide-react";
import { InputField } from "../components/ui/InputField";

const meta: Meta<typeof InputField> = {
  title: "UI-Components/InputField",
  component: InputField,
  args: {
    placeholder: "Type here...",
  },
  parameters: {
    layout: "centered"
  }
};

export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = {
  args: {
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
  },
};

export const WithValue: Story = {
  args: {
    label: "Email",
    type: "email",
    defaultValue: "user@example.com",
    placeholder: "Enter your email",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Email",
    type: "email",
    icon: Mail,
    placeholder: "Enter your email",
  },
};

export const Password: Story = {
  args: {
    label: "Password",
    type: "password",
    defaultValue: "mySecretPassword123",
    placeholder: "Enter your password",
  },
};

export const TextInput: Story = {
  args: {
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
  },
};

export const NumberInput: Story = {
  args: {
    label: "Age",
    type: "number",
    placeholder: "Enter your age",
    min: 0,
    max: 120,
  },
};

export const WithStartAdornment: Story = {
  args: {
    label: "Price",
    type: "number",
    startAdornment: "$",
    placeholder: "0.00",
    min: 0,
    step: "0.01",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Field",
    type: "text",
    defaultValue: "You cannot edit this",
    disabled: true,
  },
};
