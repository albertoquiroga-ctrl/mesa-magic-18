import { create } from 'zustand';

export type SplitMode = 'equal' | 'custom' | 'full';
export type PaymentMethod = 'card' | 'spei' | 'terminal' | 'cash' | null;
export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

export interface PaymentState {
  splitMode: SplitMode;
  tipPercent: number;
  tipAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  attempt: number;
  itemAssignments: Record<string, 'mine' | 'shared' | 'none'>;
  sharedAmong: Record<string, number>;
  rating: number;
  feedback: string;
  setSplitMode: (mode: SplitMode) => void;
  setTipPercent: (percent: number) => void;
  setTipAmount: (amount: number) => void;
  setTotal: (total: number) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setStatus: (status: PaymentStatus) => void;
  incrementAttempt: () => void;
  setItemAssignment: (key: string, value: 'mine' | 'shared' | 'none') => void;
  setSharedAmong: (key: string, count: number) => void;
  setRating: (rating: number) => void;
  setFeedback: (feedback: string) => void;
  resetAssignments: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  splitMode: 'equal',
  tipPercent: 15,
  tipAmount: 0,
  total: 0,
  paymentMethod: null,
  status: 'idle',
  attempt: 0,
  itemAssignments: {},
  sharedAmong: {},
  rating: 0,
  feedback: '',
  setSplitMode: (splitMode) => set({ splitMode }),
  setTipPercent: (tipPercent) => set({ tipPercent }),
  setTipAmount: (tipAmount) => set({ tipAmount }),
  setTotal: (total) => set({ total }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setStatus: (status) => set({ status }),
  incrementAttempt: () => set((s) => ({ attempt: s.attempt + 1 })),
  setItemAssignment: (key, value) =>
    set((s) => ({ itemAssignments: { ...s.itemAssignments, [key]: value } })),
  setSharedAmong: (key, count) =>
    set((s) => ({ sharedAmong: { ...s.sharedAmong, [key]: count } })),
  setRating: (rating) => set({ rating }),
  setFeedback: (feedback) => set({ feedback }),
  resetAssignments: () => set({ itemAssignments: {}, sharedAmong: {} }),
}));
