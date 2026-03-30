import { create } from 'zustand';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  category?: string;
  orderedByDevice?: boolean;
}

export interface OrderRound {
  id: string;
  round: number;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}

export interface OrderState {
  rounds: OrderRound[];
  currentRound: number;
  addRound: (round: OrderRound) => void;
  setCurrentRound: (n: number) => void;
  reset: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  rounds: [],
  currentRound: 1,
  addRound: (round) => set((state) => ({ rounds: [...state.rounds, round] })),
  setCurrentRound: (currentRound) => set({ currentRound }),
  reset: () => set({ rounds: [], currentRound: 1 }),
}));
