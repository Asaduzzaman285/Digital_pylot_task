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
    // ... rest of code

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="glass rounded-[2.5rem] p-8 flex flex-col h-full border border-white/40">
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
                        const Icon = moduleIcons[module] || ShieldCheck;

                        return (
                            <div key={module} className="glass rounded-[2.5rem] p-8 flex flex-col h-full border border-white/40">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-obliq-primary uppercase italic tracking-tighter">{module}</h3>
                                        <p className="text-xs font-bold text-obliq-secondary tracking-widest uppercase">{modulePermissions.length} Atoms Available</p>
                                    </div>
                                </div>

                                <div className="space-y-3 flex-1">
                                    {modulePermissions.map(perm => (
                                        <div key={perm.id} className="group relative rounded-2xl bg-white/40 p-3 hover:bg-white/80 transition-all border border-transparent hover:border-primary/20">
                                            <div className="flex items-center justify-between">
                                                <code className="text-[12px] font-black text-primary uppercase tracking-tighter">{perm.atom}</code>
                                            </div>
                                            <p className="mt-1 text-[11px] font-bold text-obliq-secondary tracking-tight leading-none opacity-60 group-hover:opacity-100 transition-opacity">
                                                Standard access for {perm.atom.split(':')[0]} roles.
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
