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
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "view:dashboard" },
    { name: "Users", href: "/users", icon: Users, permission: "view:users" },
    { name: "Leads", href: "/leads", icon: Briefcase, permission: "view:leads" },
    { name: "Tasks", href: "/tasks", icon: CheckSquare, permission: "view:tasks" },
    { name: "Permissions", href: "/permissions", icon: ShieldCheck, permission: "manage:permissions" },
    { name: "Audit Logs", href: "/audit", icon: FileText, permission: "view:audit" },
    { name: "Settings", href: "/settings", icon: Settings, permission: "view:settings" },
];

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();
    const { hasPermission } = usePermissions();

    // Close sidebar when pathname changes (for mobile)
    useEffect(() => {
        if (onClose && isOpen) {
            onClose();
        }
    }, [pathname]);

    const filteredNavigation = navigation.filter((item) => hasPermission(item.permission));

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden transition-opacity animate-in fade-in duration-300" 
                    onClick={onClose}
                />
            )}

            <div className={cn(
                "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/50 bg-white/95 backdrop-blur-xl transition-all duration-300 ease-in-out lg:static lg:translate-x-0 shadow-2xl lg:shadow-none",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-20 items-center justify-between px-8">
                    <div className="flex items-center">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group hover:rotate-6 transition-transform">
                            <span className="text-xl font-black text-white italic">O</span>
                        </div>
                        <span className="ml-3 text-2xl font-black tracking-tighter text-obliq-primary italic">Obliq</span>
                    </div>
                    {onClose && (
                        <button 
                            onClick={onClose} 
                            className="lg:hidden rounded-xl p-2 text-obliq-secondary hover:bg-primary/10 hover:text-primary transition-all"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    )}
                </div>

                <nav className="flex-1 space-y-2 px-6 py-6 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-[11px] font-black uppercase tracking-[0.2em] text-obliq-secondary/40 mb-4">Core Modules</p>
                    {filteredNavigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-bold transition-all",
                                    isActive
                                        ? "bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]"
                                        : "text-obliq-secondary hover:bg-primary/5 hover:text-primary"
                                )}
                            >
                                <div className="flex items-center">
                                    <item.icon
                                        className={cn(
                                            "mr-3 h-5 w-5 transition-transform group-hover:scale-110",
                                            isActive ? "text-white" : "text-obliq-secondary group-hover:text-primary"
                                        )}
                                    />
                                    {item.name}
                                </div>
                                {isActive && <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-border/50 p-6">
                    <div className="flex items-center rounded-3xl bg-gray-50/50 p-4 ring-1 ring-black/5 hover:bg-white transition-colors cursor-default group">
                        <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-black text-lg shadow-inner group-hover:scale-110 transition-transform">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <div className="ml-3 min-w-0">
                            <p className="truncate text-base font-black text-obliq-primary italic">
                                {user?.firstName}
                            </p>
                            <span className="inline-flex rounded-lg bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary">
                                {user?.role.name}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-destructive/10 px-4 py-4 text-sm font-black uppercase tracking-[0.15em] text-destructive hover:bg-destructive hover:text-white transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-destructive/5"
                    >
                        <LogOut className="h-4 w-4" />
                        Log Out
                    </button>
                </div>
            </div>
        </>
    );
}
