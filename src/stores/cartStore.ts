/**
 * Cart Store
 * 
 * Manages the items the guest wants to order in the current round.
 * Items live here until "sent" to the kitchen, at which point they
 * move to the Order Store as a new round.
 * 
 * Identity: two items are considered the same only when they share
 * the same menu id AND identical modifiers. This lets "Tacos — Maíz"
 * and "Tacos — Harina" coexist as separate line items.
 */
import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SelectedModifier {
  groupId: string;
  groupLabel: string;
  optionId: string;
  optionLabel: string;
  extraPrice: number;
}

export interface CartItem {
  /** Unique cart-line key (menuId + sorted modifier fingerprint) */
  cartKey: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  modifiers?: SelectedModifier[];
}

export type CartStatus = 'draft' | 'sent' | 'confirmed';

export interface CartState {
  items: CartItem[];
  round: number;
  status: CartStatus;

  // Actions
  addItem: (item: Omit<CartItem, 'quantity' | 'cartKey'>) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  setStatus: (status: CartStatus) => void;

  // Derived (computed via get())
  getTotal: () => number;
  getItemCount: () => number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Deterministic key from menu id + chosen modifiers */
function buildCartKey(id: string, modifiers?: SelectedModifier[]): string {
  if (!modifiers || modifiers.length === 0) return id;
  const suffix = [...modifiers]
    .map((m) => `${m.groupId}:${m.optionId}`)
    .sort()
    .join('|');
  return `${id}__${suffix}`;
}

/** Unit price including modifier surcharges */
function unitPrice(item: { price: number; modifiers?: SelectedModifier[] }): number {
  const extras = (item.modifiers ?? []).reduce((s, m) => s + m.extraPrice, 0);
  return item.price + extras;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useCartStore = create<CartState>((set, get) => ({
  // State
  items: [],
  round: 1,
  status: 'draft',

  // --- Mutation actions ---

  addItem: (item) =>
    set((state) => {
      const cartKey = buildCartKey(item.id, item.modifiers);
      const existing = state.items.find((i) => i.cartKey === cartKey);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.cartKey === cartKey ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, cartKey, quantity: 1 }] };
    }),

  removeItem: (cartKey) =>
    set((state) => ({
      items: state.items.filter((i) => i.cartKey !== cartKey),
    })),

  updateQuantity: (cartKey, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.cartKey !== cartKey)
          : state.items.map((i) => (i.cartKey === cartKey ? { ...i, quantity } : i)),
    })),

  clearCart: () => set({ items: [], status: 'draft' }),

  setStatus: (status) => set({ status }),

  // --- Computed helpers ---

  getTotal: () =>
    get().items.reduce((sum, i) => sum + unitPrice(i) * i.quantity, 0),

  getItemCount: () =>
    get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
