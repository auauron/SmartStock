import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleSwitch } from "../components/ui/ToggleSwitch";

const meta: Meta<typeof ToggleSwitch> = {
  title: "Components/ToggleSwitch",
  component: ToggleSwitch,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ToggleSwitch>;

export const Default: Story = {
  args: {
    label: "Email Notifications",
    description: "Receive alerts when stock level is critical",
    id: "toggle-1",
  },
};

export const Checked: Story = {
  args: {
    label: "Dark Mode",
    description: "Switch between light and dark themes",
    id: "toggle-checked",
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Beta Features",
    description: "Experimental analytics is currently locked",
    id: "toggle-disabled",
    disabled: true,
  },
};

export const NoDescription: Story = {
  args: {
    label: "Visible to Public",
    id: "toggle-no-desc",
  },
};
