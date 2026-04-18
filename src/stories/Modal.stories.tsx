import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  args: {
    isOpen: true,
    onClose: () => console.log("Close"),
    title: "Example Modal",
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <p className="text-gray-600 mb-4">
          This is a standard modal component used for dialogs and focused tasks.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => {}}>Cancel</Button>
          <Button onClick={() => {}}>Confirm Action</Button>
        </div>
      </div>
    ),
  },
};

export const SmallContent: Story = {
  args: {
    title: "Logout Confirmation",
    children: (
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to sign out? Your session will be ended.
        </p>
        <div className="flex flex-col gap-2">
          <Button variant="danger" className="w-full">Sign Out</Button>
          <Button variant="secondary" className="w-full">Stay Logged In</Button>
        </div>
      </div>
    ),
  },
};
