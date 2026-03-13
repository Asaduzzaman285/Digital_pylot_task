"use client";

import { Info, Briefcase, CheckSquare, BarChart2 } from "lucide-react";

export default function PlaceholderPage({ title, description }: { title: string, description: string }) {
    return (
        <div className="space-y-8 p-4">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-obliq-primary">{title}</h1>
                <p className="text-obliq-secondary font-medium">{description}</p>
            </div>

            <div className="glass rounded-[3rem] py-32 flex flex-col items-center justify-center text-center">
                <div className="h-24 w-24 rounded-[2rem] bg-orange-50 flex items-center justify-center border border-orange-100 shadow-inner mb-6">
                    <Info className="h-10 w-10 text-primary animate-pulse" />
                </div>
                <h2 className="text-2xl font-black text-obliq-primary italic mb-2">Module Under Construction</h2>
                <p className="text-obliq-secondary max-w-sm font-medium">
                    This module is part of the Phase 11 roadmap. We are currently finalizing the core RBAC logic and visuals.
                </p>
                <div className="mt-8 flex gap-4">
                    <div className="h-2 w-12 rounded-full bg-primary/20" />
                    <div className="h-2 w-12 rounded-full bg-primary" />
                    <div className="h-2 w-12 rounded-full bg-primary/20" />
                </div>
            </div>
        </div>
    );
}
