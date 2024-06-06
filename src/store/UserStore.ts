import create from 'zustand';

type User = {
  email: string;
};

type UserStore = {
  user: User | null;
  set: (user: User) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  set: (user) => set(() => ({ user })),
}));