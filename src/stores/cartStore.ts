/**
 * Cart Store
 * 
 * Manages the items the guest wants to order in the current round.
 * Items live here until "sent" to the kitchen, at which point they
 * move to the Order Store as a new round.
 */
import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  modifiers?: string[];
}

export type CartStatus = 'draft' | 'sent' | 'confirmed';

export interface CartState {
  items: CartItem[];
  round: number;
  status: CartStatus;

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setStatus: (status: CartStatus) => void;

  // Derived (computed via get())
  getTotal: () => number;
  getItemCount: () => number;
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
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        // Increment quantity if item already in cart
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.id !== id)
          : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),

  clearCart: () => set({ items: [], status: 'draft' }),

  setStatus: (status) => set({ status }),

  // --- Computed helpers ---

  getTotal: () =>
    get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  getItemCount: () =>
    get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
