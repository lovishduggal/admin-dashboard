import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Tenant {
    id: number;
    name: string;
    address: string;
}
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    tenant?: Tenant;
}

interface AuthState {
    mode: string;
    setMode: (mode: string) => void;
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    devtools((set) => ({
        mode: 'light',
        setMode: (mode: string) => set({ mode }),
        user: null,
        setUser: (user) => set({ user }),
        logout: () => set({ user: null }),
    }))
);
