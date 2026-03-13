"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import apiClient from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, setAuth, setLoading, isLoading } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const initialized = useRef(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (initialized.current) return;
            initialized.current = true;

            const token = localStorage.getItem('accessToken');
            
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Pre-set the header for this initialization call
                apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
                const { data } = await apiClient.get("/auth/me");
                setAuth(data, token, data.permissions || []);
            } catch (err) {
                console.error("Auth check failed:", err);
                localStorage.removeItem('accessToken');
                setLoading(false);
            }
        };

        checkAuth();
    }, [setAuth, setLoading]);

    useEffect(() => {
        // Only run redirect logic when we are definitely NOT loading
        if (isLoading) return;

        const publicPaths = ["/login"];
        const isPublicPath = publicPaths.includes(pathname);

        if (!isAuthenticated && !isPublicPath) {
            // Not logged in? Go to login.
            router.replace("/login");
        } else if (isAuthenticated && isPublicPath) {
            // Already logged in? Go to dashboard.
            router.replace("/dashboard");
        }
    }, [isAuthenticated, pathname, router, isLoading]);

    // Show a high-quality initializing screen while verifying session
    if (isLoading) {
        return (
            <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#FAF9F6]">
                <div className="h-20 w-20 rounded-[2.5rem] bg-white shadow-2xl flex items-center justify-center border border-primary/10 animate-pulse mb-8">
                    <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="text-xl font-black text-white italic">O</span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-primary opacity-40" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-obliq-secondary opacity-40">Verifying Protocol</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
