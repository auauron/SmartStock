export interface RestockEntry {
  id: string;
  inventoryId: string;
  inventoryName: string;
  quantityAdded: number;
  date: string;
  notes: string;
}

export interface RestockInventoryOption {
  id: string;
  name: string;
}

export interface CreateRestockInput {
  inventoryId: string;
  quantityAdded: number;
  notes: string;
}
