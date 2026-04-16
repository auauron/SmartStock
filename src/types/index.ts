// ─── Domain Types ────────────────────────────────────────────────────────────

export interface Inventory {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  minStock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type {
  CreateRestockInput,
  RestockEntry,
  RestockInventoryOption,
} from "./restock";

// ─── Auth / User Types ────────────────────────────────────────────────────────

export interface UserProfile {
  fullName: string;
  email: string;
  businessName: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  fullName: string;
  businessName: string;
}

// ─── Router Types ─────────────────────────────────────────────────────────────

export interface LayoutOutletContext {
  profile: UserProfile;
}
