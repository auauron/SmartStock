import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxField } from "../components/ui/CheckboxField";

const meta: Meta<typeof CheckboxField> = {
  title: "UI-Components/CheckboxField",
  component: CheckboxField,
  parameters: {
    layout: "centered",
  },
  args: {
    id: "checkbox-default",
    label: "Accept terms and conditions",
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxField>;

export const Default: Story = {
  args: {
    id: "checkbox-default",
    label: "Accept terms and conditions",
  },
};

export const Checked: Story = {
  args: {
    id: "checkbox-checked",
    label: "I agree to the privacy policy",
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    id: "checkbox-disabled",
    label: "This option is unavailable",
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    id: "checkbox-disabled-checked",
    label: "Pre-selected and locked",
    disabled: true,
    defaultChecked: true,
  },
};

export const AlignStart: Story = {
  args: {
    id: "checkbox-align-start",
    align: "start",
    label:
      "Send me emails about product updates, promotions, and announcements. You can unsubscribe at any time.",
  },
  parameters: {
    layout: "padded",
  },
};
