"use client";

import { useAuthStore } from "@/store/auth-store";
import { PermissionGate } from "@/components/layout/permission-gate";
import {
    Users,
    ClipboardList,
    TrendingUp,
    AlertCircle,
    BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useRequirePermission } from "@/hooks/use-permissions";

export default function DashboardPage() {
    useRequirePermission("view:dashboard");
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-8 p-4">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tighter text-obliq-primary italic uppercase">
                    Welcome, {user?.firstName}
                </h1>
                <p className="text-obliq-secondary font-bold tracking-tight opacity-60 uppercase text-xs tracking-[0.2em]">
                    System Command Overview & Analytics
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="glass rounded-[2rem] p-8 border border-white/40 shadow-xl">
                            <div className="flex items-center justify-between mb-8">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-12 w-12 rounded-2xl" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-6 w-14 rounded-full" />
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        <StatCard
                            title="Total Identities"
                            value="1,280"
                            icon={Users}
                            trend="+4.75%"
                            trendUp={true}
                        />
                        <StatCard
                            title="Active Pipelines"
                            value="452"
                            icon={ClipboardList}
                            trend="+10.2%"
                            trendUp={true}
                        />
                        <StatCard
                            title="Efficiency"
                            value="12.5%"
                            icon={TrendingUp}
                            trend="-1.5%"
                            trendUp={false}
                        />
                        <StatCard
                            title="Security Pulse"
                            value="Optimal"
                            icon={AlertCircle}
                            trend="Stable"
                            trendUp={true}
                        />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="glass rounded-[2.5rem] p-10 border border-white/40 shadow-2xl transition-all hover:bg-white/90">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-obliq-primary italic uppercase tracking-tighter">Live Activity Feed</h3>
                        <div className="h-2 w-12 rounded-full bg-primary/20 animate-pulse" />
                    </div>
                    
                    <div className="space-y-4">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-6 p-4">
                                    <Skeleton className="h-4 w-4 rounded-full" />
                                    <Skeleton className="h-6 flex-1 rounded-xl" />
                                    <Skeleton className="h-4 w-16 rounded-lg" />
                                </div>
                            ))
                        ) : (
                            [1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-6 rounded-2xl p-5 hover:bg-white/60 transition-all border border-transparent hover:border-primary/10 shadow-sm group">
                                    <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_rgba(232,75,28,0.6)] group-hover:scale-125 transition-transform" />
                                    <span className="flex-1 font-bold text-obliq-primary leading-snug">
                                        Security Node <code className="bg-primary/10 text-primary px-2 py-0.5 rounded-lg font-black text-xs uppercase mx-1">AUTH:GRANT</code> 
                                        elevated permissions for agent-09
                                    </span>
                                    <span className="text-[10px] font-black text-obliq-secondary uppercase tracking-widest opacity-40">2h ago</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <PermissionGate permission="view:audit">
                    <div className="glass rounded-[2.5rem] p-10 flex flex-col items-center justify-center min-h-[400px] border border-white/40 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-10 left-10">
                            <h3 className="text-2xl font-black text-obliq-primary italic uppercase tracking-tighter">Neural Health</h3>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center">
                            <div className="h-56 w-56 rounded-full border-[12px] border-primary/5 border-t-primary animate-spin-slow flex items-center justify-center relative shadow-2xl">
                                <BarChart3 className="h-16 w-16 text-primary group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="mt-10 space-y-2 text-center">
                                <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] animate-pulse">Synchronizing Data</div>
                                <div className="text-sm font-bold text-obliq-secondary opacity-60">Scanning distributed nodes for anomalies...</div>
                            </div>
                        </div>
                    </div>
                </PermissionGate>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, trend, trendUp }: any) {
    return (
        <div className="glass rounded-[2rem] p-8 transition-all hover:scale-[1.02] hover:bg-white/90 active:scale-95 group border border-white/40 shadow-xl">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-obliq-secondary opacity-60">{title}</span>
                <div className="rounded-2xl bg-primary/10 p-3 group-hover:bg-primary group-hover:text-white group-hover:rotate-12 transition-all shadow-inner">
                    <Icon className="h-6 w-6" />
                </div>
            </div>
            <div className="mt-10 flex items-baseline justify-between">
                <span className="text-4xl font-black text-obliq-primary tracking-tighter italic leading-none">{value}</span>
                <span className={cn(
                    "rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm",
                    trendUp
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                )}>
                    {trend}
                </span>
            </div>
        </div>
    );
}
