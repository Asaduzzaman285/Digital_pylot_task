"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { ShieldCheck, Lock, Globe, Database, Settings, UserCheck, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequirePermission } from "@/hooks/use-permissions";

export default function PermissionsPage() {
    useRequirePermission("manage:permissions");
    const [permissions, setPermissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    const moduleIcons: Record<string, any> = {
        dashboard: Globe,
        users: UserCheck,
        permissions: ShieldCheck,
        leads: Database,
        tasks: Settings,
        audit: Lock,
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            const { data } = await apiClient.get("/permissions");
            setPermissions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPermissions = permissions.filter(p =>
        p.atom.toLowerCase().includes(search.toLowerCase()) ||
        p.module.toLowerCase().includes(search.toLowerCase())
    );

    const modules = Array.from(new Set(permissions.map(p => p.module)));

    return (
        <div className="space-y-8 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-obliq-primary italic uppercase tracking-tighter">Permissions Matrix</h1>
                    <p className="text-obliq-secondary font-medium tracking-tight">Visual map of all available permission atoms in the system.</p>
                </div>
            </div>

            <div className="relative group max-w-2xl">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-obliq-secondary group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Filter permissions by name or module..."
                    className="glass w-full rounded-[1.5rem] py-4 pl-12 pr-4 text-obliq-primary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-bold tracking-tight"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="glass rounded-[2.5rem] p-8 flex flex-col h-full border border-white/40 shadow-xl">
                            <div className="flex items-center gap-4 mb-6">
                                <Skeleton className="h-12 w-12 rounded-2xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-14 w-full rounded-2xl" />
                                <Skeleton className="h-14 w-full rounded-2xl" />
                                <Skeleton className="h-14 w-full rounded-2xl" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map(module => {
                        const modulePermissions = filteredPermissions.filter(p => p.module === module);
                        if (modulePermissions.length === 0) return null;
                        const Icon = moduleIcons[module.toLowerCase()] || ShieldCheck;

                        return (
                            <div key={module} className="glass rounded-[2.5rem] p-8 flex flex-col h-full border border-white/40 shadow-xl group hover:scale-[1.02] transition-all">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group-hover:rotate-6 transition-transform">
                                        <Icon className="h-7 w-7 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-obliq-primary uppercase italic tracking-tighter leading-none">{module}</h3>
                                        <p className="text-[10px] font-black text-obliq-secondary tracking-widest uppercase mt-1 opacity-60">{modulePermissions.length} Atoms Available</p>
                                    </div>
                                </div>

                                <div className="space-y-3 flex-1">
                                    {modulePermissions.map(perm => (
                                        <div key={perm.id} className="group/item relative rounded-2xl bg-white/40 p-4 hover:bg-white/80 transition-all border border-transparent hover:border-primary/20">
                                            <div className="flex items-center justify-between">
                                                <code className="text-[12px] font-black text-primary uppercase tracking-tighter">{perm.atom}</code>
                                            </div>
                                            <p className="mt-1.5 text-[11px] font-bold text-obliq-secondary tracking-tight leading-snug opacity-40 group-hover/item:opacity-100 transition-opacity">
                                                Granular access atom for {perm.atom.split(':')[1]?.replace('-', ' ')} operations.
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
