// ─── Domain Types ────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  minStock: number;
}

export interface RestockEntry {
  id: string;
  productName: string;
  quantityAdded: number;
  date: string;
  notes: string;
}

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
