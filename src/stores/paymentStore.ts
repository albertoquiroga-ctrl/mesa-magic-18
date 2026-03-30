/**
 * Payment Store
 * 
 * Manages the entire checkout flow: split mode, tip, payment method,
 * item-level assignment (for "fair pay" splitting), and post-payment
 * experience rating + feedback.
 */
import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** How the bill is divided among guests */
export type SplitMode = 'equal' | 'custom' | 'full';

/** Available payment methods */
export type PaymentMethod = 'card' | 'spei' | 'terminal' | 'cash' | null;

/** Payment processing lifecycle */
export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

/** Per-item ownership assignment in "fair pay" mode */
export type ItemAssignment = 'mine' | 'shared' | 'none';

export interface PaymentState {
  // --- Split & tip ---
  splitMode: SplitMode;
  tipPercent: number;
  tipAmount: number;
  total: number;

  // --- Payment method & status ---
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  /** Tracks payment attempts (demo: first attempt fails, second succeeds) */
  attempt: number;

  // --- Fair-pay item assignments ---
  /** Maps item key → ownership assignment */
  itemAssignments: Record<string, ItemAssignment>;
  /** Maps item key → number of people sharing that item */
  sharedAmong: Record<string, number>;

  // --- Post-payment experience ---
  rating: number;
  feedback: string;

  // --- Actions ---
  setSplitMode: (mode: SplitMode) => void;
  setTipPercent: (percent: number) => void;
  setTipAmount: (amount: number) => void;
  setTotal: (total: number) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setStatus: (status: PaymentStatus) => void;
  incrementAttempt: () => void;
  setItemAssignment: (key: string, value: ItemAssignment) => void;
  setSharedAmong: (key: string, count: number) => void;
  setRating: (rating: number) => void;
  setFeedback: (feedback: string) => void;
  resetAssignments: () => void;
  /** Full reset — used when a new session starts (e.g. onboarding) */
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const INITIAL_STATE = {
  splitMode: 'equal' as SplitMode,
  tipPercent: 15,
  tipAmount: 0,
  total: 0,
  paymentMethod: null as PaymentMethod,
  status: 'idle' as PaymentStatus,
  attempt: 0,
  itemAssignments: {} as Record<string, ItemAssignment>,
  sharedAmong: {} as Record<string, number>,
  rating: 0,
  feedback: '',
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const usePaymentStore = create<PaymentState>((set) => ({
  ...INITIAL_STATE,

  // Simple setters
  setSplitMode: (splitMode) => set({ splitMode }),
  setTipPercent: (tipPercent) => set({ tipPercent }),
  setTipAmount: (tipAmount) => set({ tipAmount }),
  setTotal: (total) => set({ total }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setStatus: (status) => set({ status }),
  setRating: (rating) => set({ rating }),
  setFeedback: (feedback) => set({ feedback }),

  incrementAttempt: () =>
    set((s) => ({ attempt: s.attempt + 1 })),

  // Item-level assignment for fair-pay mode
  setItemAssignment: (key, value) =>
    set((s) => ({ itemAssignments: { ...s.itemAssignments, [key]: value } })),

  setSharedAmong: (key, count) =>
    set((s) => ({ sharedAmong: { ...s.sharedAmong, [key]: count } })),

  resetAssignments: () =>
    set({ itemAssignments: {}, sharedAmong: {} }),

  reset: () => set({ ...INITIAL_STATE }),
}));
