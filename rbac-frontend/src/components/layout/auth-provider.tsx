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

            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const { data } = await apiClient.get("/auth/me");
                setAuth(data, data.permissions);
            } catch (err) {
                console.error("Auth check failed:", err);
                setLoading(false);
            }
        };

        checkAuth();
    }, [setAuth, setLoading]);

    useEffect(() => {
        if (isLoading) return;

        const publicPaths = ["/login", "/"];
        const isPublicPath = publicPaths.includes(pathname);

        if (!isAuthenticated && !isPublicPath) {
            router.push("/login");
        } else if (isAuthenticated && isPublicPath) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, pathname, router, isLoading]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#FAF9F6]">
                <div className="h-16 w-16 rounded-[2rem] bg-white shadow-2xl flex items-center justify-center border border-primary/10 animate-pulse mb-6">
                    <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="text-sm font-black text-white italic">O</span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-obliq-secondary">Initializing Obliq</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
