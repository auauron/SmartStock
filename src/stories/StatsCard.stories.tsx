import type { Meta, StoryObj } from "@storybook/react-vite";
import { Package, AlertTriangle, RefreshCw, PhilippinePeso } from "lucide-react";
import { StatsCard } from "../components/ui/StatsCard";

const meta: Meta<typeof StatsCard> = {
  title: "Dashboard/StatsCard",
  component: StatsCard,
  parameters: {
    layout: "centered",
  },
  args: {
    loading: false,
  },
};

export default meta;
type Story = StoryObj<typeof StatsCard>;

export const Default: Story = {
  args: {
    title: "Total Inventory",
    value: "2,450",
    subtitle: "Items currently tracked",
    icon: Package,
    iconBgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
};

export const WithTrendUp: Story = {
  args: {
    title: "Monthly Revenue",
    value: "₱145,200",
    subtitle: "vs. previous month",
    icon: PhilippinePeso,
    iconBgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
    trend: {
      value: 12.5,
      label: "vs last month",
      direction: "up",
    },
  },
};

export const WithTrendDown: Story = {
  args: {
    title: "Stock Alerts",
    value: "12",
    subtitle: "Items below minimum",
    icon: AlertTriangle,
    iconBgColor: "bg-red-50",
    iconColor: "text-red-600",
    trend: {
      value: 8.2,
      label: "since yesterday",
      direction: "down",
    },
  },
};

export const WithNoBaseline: Story = {
  args: {
    title: "Weekly Restocks",
    value: "45",
    subtitle: "Units added this week",
    icon: RefreshCw,
    iconBgColor: "bg-amber-50",
    iconColor: "text-amber-600",
    trend: {
      value: "—",
      label: "no baseline",
      direction: "neutral",
    },
  },
};

export const Loading: Story = {
  args: {
    title: "Total Inventory",
    value: "2,450",
    subtitle: "Items currently tracked",
    icon: Package,
    loading: true,
  },
};
