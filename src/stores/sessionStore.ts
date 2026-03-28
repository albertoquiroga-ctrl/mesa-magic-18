import { create } from 'zustand';

export interface SessionState {
  tableNumber: number;
  guestId: string;
  jwt: string | null;
  restaurantConfig: {
    name: string;
    brandPrimary?: string;
  };
  setTable: (n: number) => void;
  setGuest: (id: string) => void;
  setJwt: (jwt: string | null) => void;
  setRestaurantConfig: (config: SessionState['restaurantConfig']) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  tableNumber: 4,
  guestId: 'guest-tu',
  jwt: null,
  restaurantConfig: { name: 'La Piazza' },
  setTable: (tableNumber) => set({ tableNumber }),
  setGuest: (guestId) => set({ guestId }),
  setJwt: (jwt) => set({ jwt }),
  setRestaurantConfig: (restaurantConfig) => set({ restaurantConfig }),
}));
