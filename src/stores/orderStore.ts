import { create } from 'zustand';

export type TrackerState = 'kitchen' | 'transit' | 'delivered';

export interface OrderRound {
  id: string;
  round: number;
  items: { name: string; quantity: number; price: number }[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  createdAt: string;
}

export interface OrderState {
  rounds: OrderRound[];
  trackerState: TrackerState;
  currentRound: number;
  addRound: (round: OrderRound) => void;
  setTrackerState: (state: TrackerState) => void;
  setCurrentRound: (n: number) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  rounds: [],
  trackerState: 'kitchen',
  currentRound: 1,
  addRound: (round) => set((state) => ({ rounds: [...state.rounds, round] })),
  setTrackerState: (trackerState) => set({ trackerState }),
  setCurrentRound: (currentRound) => set({ currentRound }),
}));
