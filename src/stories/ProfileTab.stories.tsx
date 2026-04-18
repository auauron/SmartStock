import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProfileTab } from "../components/settings/tabs/ProfileTab";

const meta: Meta<typeof ProfileTab> = {
  title: "Settings/ProfileTab",
  component: ProfileTab,
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-sm mt-8 border border-gray-100">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProfileTab>;

export const Default: Story = {
  args: {
    profile: {
      fullName: "John Doe",
      email: "john@example.com",
      businessName: "JD Electronics",
    },
    userInitials: "JD",
  },
};

export const IncompleteProfile: Story = {
  args: {
    profile: {
      fullName: "",
      email: "newuser@example.com",
      businessName: "",
    },
    userInitials: "NU",
  },
};
