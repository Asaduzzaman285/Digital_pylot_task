import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: string;
    role: { name: string };
    status: string;
}

interface AuthState {
    user: User | null;
    permissions: string[];
    isAuthenticated: boolean;
    setAuth: (user: User, permissions: string[]) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            permissions: [],
            isAuthenticated: false,
            setAuth: (user, permissions) => set({ user, permissions, isAuthenticated: true }),
            logout: () => {
                localStorage.removeItem('accessToken');
                set({ user: null, permissions: [], isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
