/**
 * Auth Store
 * 
 * Handles user authentication state and loyalty program data.
 * Distinguishes between new sign-ups (isNewUser = true) and
 * returning log-ins so the app can show context-aware post-registration screens.
 */
import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LoyaltyInfo {
  points: number;
  level: 'Bronce' | 'Plata' | 'Oro';
  nextRewardAt: number;
  /** Peso amount of available welcome/loyalty discount */
  savingsAvailable: number;
}

export interface PastVisit {
  id: string;
  date: string;
  branch: string;
  total: number;
  items: string[];
  pointsEarned: number;
}

export interface AuthUser {
  name: string;
  phone: string;
  email: string;
  loyalty: LoyaltyInfo;
  history: PastVisit[];
}

interface AuthState {
  isLoggedIn: boolean;
  /** True when the user just created their account (first-time sign-up) */
  isNewUser: boolean;
  user: AuthUser | null;

  // Actions
  login: (isNew?: boolean) => void;
  logout: () => void;
}

// ---------------------------------------------------------------------------
// Mock data (demo purposes)
// ---------------------------------------------------------------------------

const MOCK_USER: AuthUser = {
  name: 'María García',
  phone: '+52 55 1234 5678',
  email: 'maria@example.com',
  loyalty: {
    points: 340,
    level: 'Plata',
    nextRewardAt: 500,
    savingsAvailable: 50,
  },
  history: [
    {
      id: 'v1',
      date: '2026-03-15',
      branch: 'La Piazza — Polanco',
      total: 620,
      items: ['Tacos de Asada', 'Margarita Clásica', 'Guacamole'],
      pointsEarned: 62,
    },
    {
      id: 'v2',
      date: '2026-02-28',
      branch: 'La Piazza — Condesa',
      total: 485,
      items: ['Pasta con Trufa', 'Agua de Jamaica'],
      pointsEarned: 48,
    },
    {
      id: 'v3',
      date: '2026-01-10',
      branch: 'La Piazza — Polanco',
      total: 890,
      items: ['Entrecot a las Brasas', 'Ensalada Mixta', 'Mezcal Oaxaqueño', 'Margarita Clásica'],
      pointsEarned: 89,
    },
  ],
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isNewUser: false,
  user: null,

  login: (isNew = true) =>
    set({ isLoggedIn: true, isNewUser: isNew, user: MOCK_USER }),

  logout: () =>
    set({ isLoggedIn: false, isNewUser: false, user: null }),
}));
