import { create } from 'zustand';

export interface OrderRound {
  id: string;
  round: number;
  items: { name: string; quantity: number; price: number }[];
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}

export interface OrderState {
  rounds: OrderRound[];
  currentRound: number;
  addRound: (round: OrderRound) => void;
  setCurrentRound: (n: number) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  rounds: [],
  currentRound: 1,
  addRound: (round) => set((state) => ({ rounds: [...state.rounds, round] })),
  setCurrentRound: (currentRound) => set({ currentRound }),
}));
