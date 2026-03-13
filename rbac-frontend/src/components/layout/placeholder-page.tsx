"use client";

import { Info, ShieldAlert } from "lucide-react";

export default function PlaceholderPage({ title, description }: { title: string, description: string }) {
    return (
        <div className="space-y-8 p-4">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tighter text-obliq-primary italic uppercase">{title}</h1>
                <p className="text-obliq-secondary font-medium tracking-tight opacity-60">{description}</p>
            </div>

            <div className="glass rounded-[3rem] py-32 flex flex-col items-center justify-center text-center border border-white/40 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldAlert className="h-64 w-64" />
                </div>
                
                <div className="h-24 w-24 rounded-[2.5rem] bg-white shadow-xl flex items-center justify-center border border-primary/10 mb-8 animate-in zoom-in duration-500">
                    <Info className="h-10 w-10 text-primary animate-pulse" />
                </div>
                
                <h2 className="text-2xl font-black text-obliq-primary italic uppercase tracking-tighter mb-3">Module Initializing</h2>
                <p className="text-obliq-secondary max-w-sm font-bold tracking-tight opacity-60">
                    This high-security module is currently being synchronized with your permission tier. Full access will be available shortly.
                </p>
                
                <div className="mt-10 flex gap-3">
                    <div className="h-1.5 w-12 rounded-full bg-primary/10" />
                    <div className="h-1.5 w-12 rounded-full bg-primary shadow-[0_0_8px_rgba(232,75,28,0.4)]" />
                    <div className="h-1.5 w-12 rounded-full bg-primary/10" />
                </div>
            </div>
        </div>
    );
}
