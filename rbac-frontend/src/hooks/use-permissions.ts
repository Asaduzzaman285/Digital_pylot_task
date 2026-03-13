import { useAuthStore } from "@/store/auth-store";

export const usePermissions = () => {
    const { permissions, user } = useAuthStore();

    const hasPermission = (atom: string) => {
        if (user?.role.name === "ADMIN") return true;
        return permissions.includes(atom);
    };

    const hasAnyPermission = (atoms: string[]) => {
        if (user?.role.name === "ADMIN") return true;
        return atoms.some((atom) => permissions.includes(atom));
    };

    return { permissions, hasPermission, hasAnyPermission, isAdmin: user?.role.name === "ADMIN" };
};
