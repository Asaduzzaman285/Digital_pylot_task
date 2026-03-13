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
    permissions?: string[];
}

interface AuthState {
    user: User | null;
    permissions: string[];
    isAuthenticated: boolean;
    isLoading: boolean;
    setAuth: (user: User, accessToken: string, permissions: string[]) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            permissions: [],
            isAuthenticated: false,
            isLoading: true,
            setAuth: (user, accessToken, permissions) => {
                localStorage.setItem('accessToken', accessToken);
                set({ user, permissions, isAuthenticated: true, isLoading: false });
            },
            setLoading: (loading) => set({ isLoading: loading }),
            logout: () => {
                localStorage.removeItem('accessToken');
                set({ user: null, permissions: [], isAuthenticated: false, isLoading: false });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
