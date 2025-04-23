import { create } from 'zustand';

interface User {
  name: string;
  gender: 'masculino' | 'femenino' | '';
  registered: boolean;
  cards: string[]; // luego puedes usar objetos aquí
}

interface UserState extends User {
  setName: (name: string) => void;
  setGender: (gender: 'masculino' | 'femenino') => void;
  register: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: '',
  gender: '',
  registered: false,
  cards: ['Tarjeta Salud', 'Tarjeta Educación'],
  setName: (name) => set({ name }),
  setGender: (gender) => set({ gender }),
  register: () => set({ registered: true }),
}));
