export interface RestockEntry {
  id: string;
  productName: string;
  quantityAdded: number;
  date: string;
  notes: string;
}

export interface RestockProductOption {
  id: string;
  name: string;
}

export interface CreateRestockInput {
  productId: string;
  quantityAdded: number;
  notes: string;
}
