import { create } from 'zustand';

export interface Guest {
  id: string;
  name: string;
  isCurrentUser: boolean;
}

export type TableStatus = 'active' | 'paying' | 'closed';

export interface TableState {
  guests: Guest[];
  whoHasPaid: string[];
  tableStatus: TableStatus;
  setGuests: (guests: Guest[]) => void;
  markPaid: (guestId: string) => void;
  setTableStatus: (status: TableStatus) => void;
}

export const useTableStore = create<TableState>((set) => ({
  guests: [
    { id: 'guest-tu', name: 'Tú', isCurrentUser: true },
    { id: 'guest-ana', name: 'Ana', isCurrentUser: false },
    { id: 'guest-carlos', name: 'Carlos', isCurrentUser: false },
  ],
  whoHasPaid: [],
  tableStatus: 'active',
  setGuests: (guests) => set({ guests }),
  markPaid: (guestId) =>
    set((state) => ({ whoHasPaid: [...state.whoHasPaid, guestId] })),
  setTableStatus: (tableStatus) => set({ tableStatus }),
}));
