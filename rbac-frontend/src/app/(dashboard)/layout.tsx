"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Menu, Bell, Search, ChevronDown, User } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuthStore();
    const pathname = usePathname();

    const getPageTitle = () => {
        const path = pathname.split('/').pop() || 'Dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <div className="flex h-screen bg-[#FAF9F6]">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-20 border-b border-border/40 bg-white/80 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden rounded-xl p-2 text-obliq-secondary hover:bg-gray-100 transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h2 className="text-xl font-black text-obliq-primary italic tracking-tight hidden sm:block">
                            {getPageTitle()}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-6">
                        <div className="relative hidden md:block group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-obliq-secondary group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Global search..." 
                                className="w-64 rounded-xl border border-border/50 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs font-bold text-obliq-primary outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <button className="relative rounded-xl p-2 text-obliq-secondary hover:bg-gray-100 transition-all hover:scale-110">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary border-2 border-white" />
                            </button>
                            
                            <div className="h-8 w-px bg-border/40 mx-2 hidden sm:block" />

                            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-black text-obliq-primary leading-tight italic">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                                        {user?.role.name}
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center text-primary font-black shadow-sm group-hover:scale-110 transition-transform">
                                    <User className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mx-auto max-w-7xl">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
