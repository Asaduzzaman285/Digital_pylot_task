"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { History, Search, Filter, ShieldInfo, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AuditPage() {
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
                    <h1 className="text-3xl font-bold tracking-tight text-obliq-primary">Audit Logs</h1>
                    <p className="text-obliq-secondary font-medium">Transparent record of critical system actions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="glass flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-obliq-primary hover:bg-white transition-all">
                        <Filter className="h-4 w-4" />
                        Date Range
                    </button>
                    <button className="flex items-center gap-2 rounded-2xl bg-obliq-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-obliq-primary/20 hover:bg-black transition-all">
                        Export Report
                    </button>
                </div>
            </div>

            <div className="glass overflow-hidden rounded-[2.5rem] p-6">
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="py-24 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                <span className="font-black text-obliq-secondary uppercase tracking-[0.2em]">Syncing Records...</span>
                            </div>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="py-24 text-center flex flex-col items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center border border-dashed border-gray-200">
                                <History className="h-8 w-8 text-gray-300" />
                            </div>
                            <span className="font-bold text-obliq-secondary italic">No audit records found in the database.</span>
                        </div>
                    ) : (
                        logs.map((log) => (
                            <div key={log.id} className="group relative flex items-start gap-5 rounded-3xl p-6 hover:bg-white/60 transition-all border border-transparent hover:border-white/40">
                                <div className="z-10 mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5 group-hover:scale-110 transition-transform">
                                    <ShieldInfo className={cn(
                                        "h-6 w-6",
                                        log.action.includes('GRANT') ? "text-green-500" : "text-blue-500"
                                    )} />
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-black text-obliq-primary uppercase tracking-wider italic">
                                            {log.action.replace(/_/g, " ")}
                                        </h3>
                                        <span className="text-xs font-black text-obliq-secondary tracking-widest bg-white/50 px-3 py-1 rounded-full uppercase">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex items-center flex-wrap gap-2 text-sm">
                                        <span className="font-bold text-obliq-primary">{log.actor.firstName} {log.actor.lastName}</span>
                                        <span className="text-obliq-secondary font-medium italic">has executed this operation</span>
                                        {log.targetType && (
                                            <>
                                                <span className="text-obliq-secondary font-medium">on</span>
                                                <span className="rounded-lg bg-primary/10 px-2 py-0.5 font-black text-primary text-xs uppercase italic tracking-tighter">
                                                    {log.targetType}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {log.metadata && (
                                        <div className="mt-4 overflow-hidden rounded-2xl bg-black/5 p-4 group-hover:bg-white/40 transition-colors">
                                            <pre className="overflow-x-auto text-[11px] font-bold text-obliq-primary/60 font-mono">
                                                {JSON.stringify(log.metadata, null, 2)}
                                            </pre>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 pt-2">
                                        <div className="flex items-center gap-1.5 opacity-60">
                                            <div className="h-1 w-4 rounded-full bg-obliq-secondary/30" />
                                            <span className="text-[10px] font-black tracking-widest text-obliq-secondary uppercase">Node: {log.ipAddress || "127.0.0.1"}</span>
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
