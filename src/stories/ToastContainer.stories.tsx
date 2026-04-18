import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToastContainer } from "../components/ui/Toast";

const meta: Meta<typeof ToastContainer> = {
  title: "Components/ToastContainer",
  component: ToastContainer,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ToastContainer>;

export const SingleToast: Story = {
  args: {
    toasts: [
      {
        id: "1",
        message: "Inventory item updated successfully!",
        durationMs: 50000, // Long duration for development
      },
    ],
    onDismiss: (id) => console.log("Dismissed", id),
  },
};

export const MultipleToasts: Story = {
  args: {
    toasts: [
      {
        id: "1",
        message: "New stock record added.",
        durationMs: 50000,
      },
      {
        id: "2",
        message: "Settings saved successfully.",
        durationMs: 50000,
      },
    ],
    onDismiss: (id) => console.log("Dismissed", id),
  },
};

export const WithUndo: Story = {
  args: {
    toasts: [
      {
        id: "undo-1",
        message: "Deleted 'Ergonomic Chair'",
        onUndo: () => console.log("Undo logic triggered"),
        durationMs: 50000,
      },
    ],
    onDismiss: (id) => console.log("Dismissed", id),
  },
};
