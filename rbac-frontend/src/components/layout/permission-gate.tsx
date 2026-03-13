"use client";

import { usePermissions } from "@/hooks/use-permissions";
import React from "react";

interface PermissionGateProps {
    children: React.ReactNode;
    permission?: string;
    anyPermission?: string[];
    fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
    children,
    permission,
    anyPermission,
    fallback = null,
}) => {
    const { hasPermission, hasAnyPermission, isAdmin } = usePermissions();

    if (isAdmin) return <>{children}</>;

    if (permission && hasPermission(permission)) {
        return <>{children}</>;
    }

    if (anyPermission && hasAnyPermission(anyPermission)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};
