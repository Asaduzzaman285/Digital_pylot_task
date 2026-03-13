import { create } from 'zustand';

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

// Memory-only store for reliability with Next.js 14 SSR/Hydration
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    permissions: [],
    isAuthenticated: false,
    isLoading: true, // AuthProvider will set this to false after checking /auth/me
    setAuth: (user, accessToken, permissions) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
        }
        set({ user, permissions, isAuthenticated: true, isLoading: false });
    },
    setLoading: (loading) => set({ isLoading: loading }),
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
        }
        set({ user: null, permissions: [], isAuthenticated: false, isLoading: false });
    },
}));
