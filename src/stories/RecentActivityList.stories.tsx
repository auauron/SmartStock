import { Meta, StoryObj } from "@storybook/react-vite";
import { RecentActivityList } from "../components/dashboard/RecentActivityList";
import { ActivityItem } from "../utils/activity";

const mockActivities: ActivityItem[] = [
    { itemName: "Espresso Beans", action: "RESTOCK", detail: "Added 50 units", timestamp: Date.now() },
    { itemName: "Milk", action: "INSERT", detail: "New item created", timestamp: Date.now() - 3600000 },
];

const meta: Meta<typeof RecentActivityList> = {
    title: "Dashboard/RecentActivityList",
    component: RecentActivityList
};

export default meta;
type Story = StoryObj<typeof RecentActivityList>;

export const Default: Story = {
    args: {
        loading: false,
        activities: mockActivities,
    },
};

export const Loading: Story = {
    args: {
        loading: true,
        activities: [],
    },
};

export const Empty: Story = {
    args: {
        loading: false,
        activities: [],
    }
}