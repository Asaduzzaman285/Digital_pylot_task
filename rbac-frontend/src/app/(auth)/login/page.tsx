"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import apiClient from "@/lib/api";
import { AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await apiClient.post("/auth/login", { email, password });
            
            // Set token in header immediately for subsequent calls
            apiClient.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
            
            // This will set localStorage and state
            setAuth(data.user, data.accessToken, data.user.permissions || []);
            
            // Force a full page reload to /dashboard to ensure AuthProvider re-initializes correctly
            window.location.href = "/dashboard";
        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF9F6] p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl" />

            <div className="glass w-full max-w-md space-y-8 rounded-[2.5rem] p-12 bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl relative z-10 animate-in zoom-in-95 duration-500">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 rounded-[2rem] bg-white shadow-xl flex items-center justify-center border border-primary/10 mb-6 group hover:rotate-6 transition-transform">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="text-xl font-black text-white italic">O</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-obliq-primary italic uppercase">Obliq</h1>
                    <p className="mt-2 text-obliq-secondary font-bold text-xs uppercase tracking-[0.2em] opacity-60">Identity & Access Management</p>
                </div>

                <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="flex items-center gap-3 rounded-2xl bg-destructive/10 p-4 text-xs font-bold text-destructive animate-in slide-in-from-top-2">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-obliq-secondary ml-1">Secure Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-2xl border border-border bg-gray-50/50 p-4 text-sm font-bold text-obliq-primary outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                placeholder="identity@obliq.io"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-obliq-secondary">Password</label>
                                <button type="button" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:opacity-70">
                                    Reset Access
                                </button>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-2xl border border-border bg-gray-50/50 p-4 text-sm font-bold text-obliq-primary outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center ml-1">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 rounded-lg border-border text-primary focus:ring-primary/20 bg-gray-50"
                        />
                        <label htmlFor="remember-me" className="ml-3 block text-xs font-bold text-obliq-secondary opacity-60">
                            Maintain session for 30 days
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-2xl bg-primary py-5 text-xs font-black uppercase tracking-[0.3em] text-white shadow-2xl shadow-primary/30 transition-all hover:bg-primary/90 hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Authorize Session"}
                    </button>

                    <div className="pt-4 text-center">
                        <p className="text-[10px] font-black text-obliq-secondary uppercase tracking-widest opacity-40">
                            Authorized access only. 
                            <br />
                            Obliq © 2026 secure protocols active.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
