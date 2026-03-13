"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";

export default function RootPage() {
    const { isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                router.replace("/dashboard");
            } else {
                router.replace("/login");
            }
        }
    }, [isAuthenticated, isLoading, router]);

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#FAF9F6]">
            <div className="h-16 w-16 rounded-[2rem] bg-white shadow-2xl flex items-center justify-center border border-primary/10 animate-pulse mb-6">
                <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-sm font-black text-white italic">O</span>
                </div>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-obliq-secondary">Routing Session</p>
            </div>
        </div>
    );
}
