/**
 * Session Store
 * 
 * Manages the current dining session: which table, which device,
 * and restaurant-level configuration (brand, name).
 * This is the first store initialized when a guest scans a QR code.
 */
import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RestaurantConfig {
  name: string;
  brandPrimary?: string;
}

export interface SessionState {
  /** Physical table number assigned via QR scan */
  tableNumber: number;
  /** Unique device/guest identifier for this session */
  guestId: string;
  /** Auth token (null when guest is anonymous) */
  jwt: string | null;
  /** Restaurant-level config loaded at session start */
  restaurantConfig: RestaurantConfig;

  // Actions
  setTable: (n: number) => void;
  setGuest: (id: string) => void;
  setJwt: (jwt: string | null) => void;
  setRestaurantConfig: (config: RestaurantConfig) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useSessionStore = create<SessionState>((set) => ({
  // State
  tableNumber: 4,
  guestId: 'guest-tu',
  jwt: null,
  restaurantConfig: { name: 'La Piazza' },

  // Actions
  setTable: (tableNumber) => set({ tableNumber }),
  setGuest: (guestId) => set({ guestId }),
  setJwt: (jwt) => set({ jwt }),
  setRestaurantConfig: (restaurantConfig) => set({ restaurantConfig }),
}));
