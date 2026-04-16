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

// ─── Audit Logs ────────────────────────────────────────────────────────

export interface AuditLogChanges {
    [key: string]: {from: string | number | null; to: string | number | null};
}

export interface AuditLog {
    id: string;
    userId: string;
    itemName: string;
    action: 'INSERT' | 'UPDATE' | 'DELETE';
    changes: AuditLogChanges | null;
    createdAt: Date;
}

export type AuditLogKey = 'name' | 'category' | 'price' | 'quantity' | 'minStock';

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
