import { create } from 'zustand';

export interface LoyaltyInfo {
  points: number;
  level: 'Bronce' | 'Plata' | 'Oro';
  nextRewardAt: number;
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
  user: AuthUser | null;
  login: (email?: string, password?: string) => void;
  logout: () => void;
}

const mockUser: AuthUser = {
  name: 'María García',
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

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: () => set({ isLoggedIn: true, user: mockUser }),
  logout: () => set({ isLoggedIn: false, user: null }),
}));
