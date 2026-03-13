"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { usePermissions } from "@/hooks/use-permissions";
import {
    LayoutDashboard,
    Users,
    Settings,
    ShieldCheck,
    FileText,
    Briefcase,
    CheckSquare,
    BarChart3,
    LogOut,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "view:dashboard" },
    { name: "Users", href: "/users", icon: Users, permission: "view:users" },
    { name: "Leads", href: "/leads", icon: Briefcase, permission: "view:leads" },
    { name: "Tasks", href: "/tasks", icon: CheckSquare, permission: "view:tasks" },
    { name: "Permissions", href: "/permissions", icon: ShieldCheck, permission: "manage:permissions" },
    { name: "Audit Logs", href: "/audit", icon: FileText, permission: "view:audit" },
    { name: "Settings", href: "/settings", icon: Settings, permission: "view:settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();
    const { hasPermission } = usePermissions();

    const filteredNavigation = navigation.filter((item) => hasPermission(item.permission));

    return (
        <div className="flex h-screen w-64 flex-col border-r border-border/50 bg-sidebar/50 backdrop-blur-xl">
            <div className="flex h-20 items-center px-8">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-xl font-bold text-white">O</span>
                </div>
                <span className="ml-3 text-2xl font-bold tracking-tight text-obliq-primary">Obliq</span>
            </div>

            <nav className="flex-1 space-y-1 px-4 py-4">
                {filteredNavigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all",
                                isActive
                                    ? "bg-primary/10 text-primary shadow-sm"
                                    : "text-obliq-secondary hover:bg-white/50 hover:text-obliq-primary"
                            )}
                        >
                            <div className="flex items-center">
                                <item.icon
                                    className={cn(
                                        "mr-3 h-5 w-5 transition-colors",
                                        isActive ? "text-primary" : "text-obliq-secondary group-hover:text-obliq-primary"
                                    )}
                                />
                                {item.name}
                            </div>
                            {isActive && <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-border/50 p-4">
                <div className="flex items-center rounded-2xl bg-white/40 p-3 ring-1 ring-black/5">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div className="ml-3 min-w-0">
                        <p className="truncate text-sm font-semibold text-obliq-primary">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="truncate text-xs text-obliq-secondary uppercase font-bold tracking-wider">
                            {user?.role.name}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => logout()}
                    className="mt-4 flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </button>
            </div>
        </div>
    );
}
