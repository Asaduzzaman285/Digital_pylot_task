"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Basic protection logic
        // Basic protection logic
        const publicPaths = ["/login"];
        const isPublicPath = publicPaths.includes(pathname);

        if (!isAuthenticated && !isPublicPath) {
            router.push("/login");
        } else if (isAuthenticated && isPublicPath) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, pathname, router]);

    return <>{children}</>;
}
