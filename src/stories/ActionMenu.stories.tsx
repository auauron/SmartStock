import type { Meta, StoryObj } from "@storybook/react-vite";
import { Edit, Trash2, Eye, Share2 } from "lucide-react";
import { ActionMenu } from "../components/ui/ActionMenu";

const meta: Meta<typeof ActionMenu> = {
  title: "Components/ActionMenu",
  component: ActionMenu,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ActionMenu>;

export const Default: Story = {
  args: {
    items: [
      {
        label: "View Details",
        icon: Eye,
        onClick: () => console.log("View"),
      },
      {
        label: "Edit Item",
        icon: Edit,
        onClick: () => console.log("Edit"),
      },
      {
        label: "Delete",
        icon: Trash2,
        onClick: () => console.log("Delete"),
        variant: "danger",
      },
    ],
  },
};

export const ManyItems: Story = {
  args: {
    items: [
      { label: "View", icon: Eye, onClick: () => {} },
      { label: "Edit", icon: Edit, onClick: () => {} },
      { label: "Share", icon: Share2, onClick: () => {} },
      { label: "Archive", icon: Trash2, onClick: () => {} },
      { label: "Remove", icon: Trash2, onClick: () => {}, variant: "danger" },
    ],
  },
};
