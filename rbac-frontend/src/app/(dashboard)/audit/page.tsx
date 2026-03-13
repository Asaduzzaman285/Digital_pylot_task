"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { History, Filter, Shield, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequirePermission } from "@/hooks/use-permissions";

export default function AuditPage() {
    useRequirePermission("view:audit");
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const { data } = await apiClient.get("/audit");
            setLogs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-obliq-primary italic uppercase">Audit Logs</h1>
                    <p className="text-obliq-secondary font-medium tracking-tight">Transparent, append-only record of critical system actions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="glass flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-obliq-primary hover:bg-white transition-all shadow-sm">
                        <Filter className="h-4 w-4" />
                        Filter Range
                    </button>
                    <button className="flex items-center gap-2 rounded-2xl bg-obliq-primary px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-obliq-primary/20 hover:bg-black transition-all active:scale-95">
                        Export Report
                    </button>
                </div>
            </div>

            <div className="glass overflow-hidden rounded-[2.5rem] p-6 border border-white/40 shadow-2xl">
                <div className="space-y-4">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-start gap-5 p-6 animate-in fade-in duration-500">
                                <Skeleton className="h-14 w-14 rounded-2xl" />
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-5 w-32 rounded-full" />
                                    </div>
                                    <Skeleton className="h-4 w-full max-w-lg" />
                                    <Skeleton className="h-24 w-full rounded-3xl" />
                                </div>
                            </div>
                        ))
                    ) : logs.length === 0 ? (
                        <div className="py-32 text-center flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
                            <div className="h-20 w-20 rounded-[2rem] bg-gray-50 flex items-center justify-center border border-dashed border-gray-200 shadow-inner">
                                <History className="h-10 w-10 text-gray-300" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xl font-black text-obliq-primary italic">No Records Found</p>
                                <p className="text-sm font-bold text-obliq-secondary opacity-60">The audit vault is currently empty.</p>
                            </div>
                        </div>
                    ) : (
                        logs.map((log) => (
                            <div key={log.id} className="group relative flex items-start gap-5 rounded-[2rem] p-6 hover:bg-white/60 transition-all border border-transparent hover:border-white/40 shadow-sm hover:shadow-md">
                                <div className="z-10 mt-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5 group-hover:scale-110 group-hover:rotate-3 transition-all">
                                    <Shield className={cn(
                                        "h-7 w-7",
                                        log.action.includes('GRANT') ? "text-green-500" : 
                                        log.action.includes('LOGIN') ? "text-blue-500" : "text-primary"
                                    )} />
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-black text-obliq-primary uppercase tracking-tight italic leading-none">
                                            {log.action.replace(/_/g, " ")}
                                        </h3>
                                        <span className="text-[10px] font-black text-obliq-secondary tracking-widest bg-white/80 px-4 py-1.5 rounded-full uppercase border border-black/5 shadow-sm">
                                            {new Date(log.createdAt).toLocaleString(undefined, {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex items-center flex-wrap gap-2 text-sm">
                                        <span className="font-black text-obliq-primary italic bg-primary/5 px-2 py-0.5 rounded-lg">{log.actor.firstName} {log.actor.lastName}</span>
                                        <span className="text-obliq-secondary font-bold opacity-60">triggered this system event</span>
                                        {log.targetType && (
                                            <>
                                                <span className="text-obliq-secondary font-medium">on target:</span>
                                                <span className="rounded-lg bg-black/5 px-2 py-0.5 font-black text-obliq-primary text-xs uppercase italic tracking-tighter">
                                                    {log.targetType}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {log.metadata && (
                                        <div className="mt-4 overflow-hidden rounded-2xl bg-black/[0.03] p-5 group-hover:bg-white/80 transition-all border border-transparent group-hover:border-primary/10">
                                            <pre className="overflow-x-auto text-[11px] font-black text-primary/70 font-mono tracking-tight leading-relaxed">
                                                {JSON.stringify(log.metadata, null, 2)}
                                            </pre>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 pt-2">
                                        <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <div className="h-1.5 w-6 rounded-full bg-primary/30" />
                                            <span className="text-[10px] font-black tracking-[0.2em] text-obliq-secondary uppercase italic">Node: {log.ipAddress || "127.0.0.1"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
