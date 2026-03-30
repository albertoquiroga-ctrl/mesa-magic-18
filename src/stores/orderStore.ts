/**
 * Order Store
 * 
 * Tracks all rounds of orders sent to the kitchen.
 * Each "round" represents a batch of items submitted together.
 * Round 0 is reserved for items ordered by other guests at the table
 * before this device started ordering.
 */
import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  category?: string;
  /** True if this item was ordered from the current device */
  orderedByDevice?: boolean;
}

export interface OrderRound {
  id: string;
  round: number;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'rejected';
  /** ISO 8601 timestamp — used to calculate individual prep-time countdowns */
  createdAt: string;
}

export interface OrderState {
  rounds: OrderRound[];
  /** Next round number to assign when the guest sends a new order */
  currentRound: number;

  // Actions
  addRound: (round: OrderRound) => void;
  setCurrentRound: (n: number) => void;
  /** Resets all order data — used when a new session starts (e.g. onboarding) */
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const INITIAL_STATE = { rounds: [] as OrderRound[], currentRound: 1 };

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useOrderStore = create<OrderState>((set) => ({
  ...INITIAL_STATE,

  addRound: (round) =>
    set((state) => ({ rounds: [...state.rounds, round] })),

  setCurrentRound: (currentRound) => set({ currentRound }),

  reset: () => set({ ...INITIAL_STATE }),
}));
