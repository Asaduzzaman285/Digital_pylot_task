"use client";

import { Box, Lock } from "lucide-react";

export default function PlaceholderModule({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 glass rounded-[2.5rem] border border-white/40 shadow-xl bg-white/40 backdrop-blur-sm">
            <div className="relative mb-8">
                <div className="h-20 w-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Box className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center border border-black/5">
                    <Lock className="h-4 w-4 text-obliq-secondary" />
                </div>
            </div>
            
            <h2 className="text-2xl font-black text-obliq-primary italic uppercase tracking-tighter mb-2">{title}</h2>
            <p className="text-obliq-secondary font-bold text-xs tracking-widest uppercase opacity-40">Secure Environment Initialized</p>
            
            <div className="mt-8 px-6 py-2 rounded-full bg-primary/5 border border-primary/10">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Synchronization in progress</span>
            </div>
        </div>
    );
}
