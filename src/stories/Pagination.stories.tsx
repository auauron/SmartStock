import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "../components/ui/Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Start: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (p) => console.log("Go to page", p),
  },
};

export const Middle: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: (p) => console.log("Go to page", p),
  },
};

export const End: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    onPageChange: (p) => console.log("Go to page", p),
  },
};

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 3,
    onPageChange: (p) => console.log("Go to page", p),
  },
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    onPageChange: (p) => console.log("Go to page", p),
  },
};
