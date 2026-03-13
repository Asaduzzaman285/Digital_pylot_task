"use client";

import { useAuthStore } from "@/store/auth-store";
import { PermissionGate } from "@/components/layout/permission-gate";
import {
    Users,
    ClipboardList,
    TrendingUp,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const { user } = useAuthStore();

    return (
        <div className="space-y-8 p-4">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-obliq-primary">
                    Welcome back, {user?.firstName}
                </h1>
                <p className="text-obliq-secondary font-medium">
                    Here's an overview of the system status.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Users"
                    value="1,280"
                    icon={Users}
                    trend="+4.75%"
                    trendUp={true}
                />
                <StatCard
                    title="Active Leads"
                    value="452"
                    icon={ClipboardList}
                    trend="+10.2%"
                    trendUp={true}
                />
                <StatCard
                    title="Conversion"
                    value="12.5%"
                    icon={TrendingUp}
                    trend="-1.5%"
                    trendUp={false}
                />
                <StatCard
                    title="Security Alerts"
                    value="2"
                    icon={AlertCircle}
                    trend="Stable"
                    trendUp={true}
                />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="glass rounded-3xl p-8 transition-all hover:bg-white/90">
                    <h3 className="text-xl font-bold text-obliq-primary px-2">Recent Activity</h3>
                    <div className="mt-8 space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4 rounded-2xl p-4 hover:bg-white/50 transition-colors">
                                <div className="h-3 w-3 rounded-full bg-primary" />
                                <span className="flex-1 font-medium text-obliq-primary">
                                    System Admin granted <code className="bg-primary/10 text-primary px-2 py-0.5 rounded-lg">'manage:users'</code> to team-lead-01
                                </span>
                                <span className="text-xs font-bold text-obliq-secondary uppercase tracking-wider">2h ago</span>
                            </div>
                        ))}
                    </div>
                </div>

                <PermissionGate permission="view:audit-log">
                    <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px]">
                        <h3 className="text-xl font-bold text-obliq-primary w-full text-left mb-auto">Global Health</h3>
                        <div className="mt-8 flex flex-col items-center justify-center">
                            <div className="h-48 w-48 rounded-full border-8 border-primary/20 border-t-primary animate-spin-slow flex items-center justify-center relative">
                                <BarChart3 className="h-12 w-12 text-primary" />
                            </div>
                            <div className="mt-6 text-sm font-bold text-obliq-secondary uppercase tracking-widest">
                                Processing Analytics...
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
        <div className="glass rounded-3xl p-6 transition-all hover:scale-[1.02] hover:bg-white/90 active:scale-95 group">
            <div className="flex items-center justify-between text-obliq-secondary">
                <span className="text-sm font-bold uppercase tracking-wider">{title}</span>
                <div className="rounded-xl bg-primary/10 p-2 group-hover:bg-primary group-hover:text-white transition-all">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div className="mt-6 flex items-baseline justify-between">
                <span className="text-3xl font-black text-obliq-primary tracking-tight">{value}</span>
                <span className={cn(
                    "rounded-full px-3 py-1 text-xs font-black",
                    trendUp
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                )}>
                    {trend}
                </span>
            </div>
        </div>
    );
}

import { BarChart3 } from "lucide-react";
