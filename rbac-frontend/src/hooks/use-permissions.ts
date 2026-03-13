import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const usePermissions = () => {
    const { permissions, user, isLoading } = useAuthStore();

    const hasPermission = (atom: string) => {
        if (!user) return false;
        if (user.role.name === "ADMIN") return true;
        return permissions.includes(atom);
    };

    const hasAnyPermission = (atoms: string[]) => {
        if (!user) return false;
        if (user.role.name === "ADMIN") return true;
        return atoms.some((atom) => permissions.includes(atom));
    };

    return { permissions, hasPermission, hasAnyPermission, isAdmin: user?.role.name === "ADMIN", isLoading };
};

export const useRequirePermission = (atom: string) => {
    const { hasPermission, isLoading } = usePermissions();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !hasPermission(atom)) {
            router.push("/forbidden");
        }
    }, [atom, hasPermission, isLoading, router]);

    return { isLoading };
};
