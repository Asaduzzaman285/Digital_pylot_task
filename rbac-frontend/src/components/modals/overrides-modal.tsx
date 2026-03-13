"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/api";
import { ShieldCheck, X, Loader2, CheckCircle2, AlertCircle, Search, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverridesModalProps {
    user: any;
    onClose: () => void;
    onSuccess: () => void;
}

export function OverridesModal({ user, onClose, onSuccess }: OverridesModalProps) {
    const [allPermissions, setAllPermissions] = useState<any[]>([]);
    const [userPermissions, setUserPermissions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchData();
    }, [user.id]);

    const fetchData = async () => {
        try {
            const [permsRes, userRes] = await Promise.all([
                apiClient.get("/permissions"),
                apiClient.get(`/users/${user.id}`)
            ]);
            setAllPermissions(permsRes.data);
            // userPermissions in User object are Permission objects, extract atoms
            setUserPermissions(userRes.data.userPermissions.map((up: any) => up.permission.atom));
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePermission = async (atom: string) => {
        const isGranted = userPermissions.includes(atom);
        setIsSubmitting(true);
        setError("");

        try {
            if (isGranted) {
                await apiClient.delete("/permissions/revoke", { data: { userId: user.id, permissionAtom: atom } });
                setUserPermissions(userPermissions.filter(p => p !== atom));
            } else {
                await apiClient.post("/permissions/grant", { userId: user.id, permissionAtom: atom });
                setUserPermissions([...userPermissions, atom]);
            }
            setStatus("success");
            setTimeout(() => setStatus("idle"), 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || "Action blocked by grant ceiling or network error.");
            setStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredPerms = allPermissions.filter(p =>
        p.atom.toLowerCase().includes(search.toLowerCase()) ||
        p.module.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="glass w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white p-0 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-8 border-b border-white/40">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                <ShieldCheck className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-obliq-primary italic tracking-tight">Permission Overrides</h2>
                                <p className="text-sm font-bold text-obliq-secondary">Managing granular access for <span className="text-primary font-black">{user.firstName} {user.lastName}</span></p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-2xl p-2 text-obliq-secondary hover:bg-primary/10 hover:text-primary transition-all"
                        >
                            <X className="h-7 w-7" />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="px-8 py-4 bg-gray-50/50">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-obliq-secondary group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search permission atoms..."
                            className="w-full rounded-2xl border border-border bg-white py-3 pl-10 pr-4 text-sm font-bold text-obliq-primary outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-8 py-4 space-y-3">
                    {isLoading ? (
                        <div className="py-20 text-center animate-pulse">
                            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                            <span className="font-black text-obliq-secondary tracking-widest uppercase">Syncing Security Matrix...</span>
                        </div>
                    ) : (
                        filteredPerms.map((perm) => (
                            <div
                                key={perm.id}
                                className={cn(
                                    "group flex items-center justify-between rounded-3xl p-4 transition-all border",
                                    userPermissions.includes(perm.atom)
                                        ? "bg-primary/5 border-primary/20"
                                        : "bg-white/40 border-transparent hover:border-gray-100 hover:bg-white"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "h-10 w-10 rounded-2xl flex items-center justify-center transition-all",
                                        userPermissions.includes(perm.atom)
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : "bg-gray-100 text-obliq-secondary"
                                    )}>
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-obliq-primary uppercase tracking-tighter italic">{perm.atom}</h4>
                                        <p className="text-[10px] font-bold text-obliq-secondary uppercase tracking-widest">{perm.module} Module</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => togglePermission(perm.atom)}
                                    disabled={isSubmitting}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm",
                                        userPermissions.includes(perm.atom)
                                            ? "bg-primary text-white hover:bg-primary/90"
                                            : "bg-white text-obliq-secondary hover:bg-primary hover:text-white"
                                    )}
                                >
                                    {userPermissions.includes(perm.atom) ? "Revoke Access" : "Grant Access"}
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer info/Status */}
                <div className="p-6 border-t border-white/40 bg-gray-50/50">
                    {status === 'error' && (
                        <div className="flex items-center gap-3 text-destructive animate-in slide-in-from-bottom-2">
                            <AlertCircle className="h-5 w-5" />
                            <span className="text-xs font-black uppercase tracking-tighter">{errorMessage}</span>
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="flex items-center gap-3 text-green-600 animate-in slide-in-from-bottom-2">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-xs font-black uppercase tracking-tighter">Security State Updated</span>
                        </div>
                    )}
                    {status === 'idle' && (
                        <div className="flex items-center gap-3 text-obliq-secondary opacity-60">
                            <Info className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Only administrators can apply permission overrides. Actions are audited.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
