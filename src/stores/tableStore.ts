/**
 * Table Store
 * 
 * Represents the physical table and everyone sitting at it.
 * Tracks which guests have paid and the overall table lifecycle status.
 */
import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Guest {
  id: string;
  name: string;
  /** True for the device owner — used to distinguish "my" orders */
  isCurrentUser: boolean;
}

export type TableStatus = 'active' | 'paying' | 'closed';

export interface TableState {
  guests: Guest[];
  /** Guest IDs that have completed payment */
  whoHasPaid: string[];
  tableStatus: TableStatus;

  // Actions
  setGuests: (guests: Guest[]) => void;
  markPaid: (guestId: string) => void;
  setTableStatus: (status: TableStatus) => void;
  /** Full reset — used when a new session starts (e.g. onboarding) */
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Defaults (demo data — 3 guests at the table)
// ---------------------------------------------------------------------------

const INITIAL_GUESTS: Guest[] = [
  { id: 'guest-tu', name: 'Tú', isCurrentUser: true },
  { id: 'guest-ana', name: 'Ana', isCurrentUser: false },
  { id: 'guest-carlos', name: 'Carlos', isCurrentUser: false },
];

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useTableStore = create<TableState>((set) => ({
  guests: INITIAL_GUESTS,
  whoHasPaid: [],
  tableStatus: 'active',

  setGuests: (guests) => set({ guests }),

  markPaid: (guestId) =>
    set((state) => ({ whoHasPaid: [...state.whoHasPaid, guestId] })),

  setTableStatus: (tableStatus) => set({ tableStatus }),

  reset: () =>
    set({ guests: INITIAL_GUESTS, whoHasPaid: [], tableStatus: 'active' }),
}));
