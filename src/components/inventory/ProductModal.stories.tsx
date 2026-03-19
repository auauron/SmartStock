import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProductModal } from './ProductModal';

const meta: Meta<typeof ProductModal> = {
  title: 'Inventory/ProductModal',
  component: ProductModal,
  tags: ['autodocs'],
  args: {
    onClose: () => console.log('Close button clicked'),
    onSave: (data) => console.log('Saved product data:', data),
  },
};

export default meta;
type Story = StoryObj<typeof ProductModal>;

export const AddNewProduct: Story = {
  args: {
    isOpen: true, 
  },
};

export const EditProduct: Story = {
  args: {
    isOpen: true,
    product: {
      id: 'prod_12345',
      name: 'Ergonomic Office Chair',
      category: 'Furniture',
      price: 199.99,
      quantity: 45,
      minStock: 10,
    },
  },
};