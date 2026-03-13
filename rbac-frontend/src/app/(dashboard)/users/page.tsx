"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { PermissionGate } from "@/components/layout/permission-gate";
import { Settings2, ShieldCheck, UserPlus, Search, X, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { OverridesModal } from "@/components/modals/overrides-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequirePermission } from "@/hooks/use-permissions";
import toast from "react-hot-toast";

export default function UsersPage() {
    useRequirePermission("view:users");
    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedUserForOverrides, setSelectedUserForOverrides] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        roleId: "",
    });

    const [roles, setRoles] = useState<any[]>([]);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const { data } = await apiClient.get("/users/roles");
            setRoles(data);
            if (data.length > 0) {
                const customerRole = data.find((r: any) => r.name === 'CUSTOMER');
                setFormData(prev => ({ ...prev, roleId: customerRole?.id || data[0].id }));
            }
        } catch (err) {
            console.error("Failed to fetch roles:", err);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await apiClient.get("/users");
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await apiClient.post("/users", formData);
            setSuccessMessage("User created successfully!");
            toast.success("User created successfully!");
            setTimeout(() => {
                setIsAddModalOpen(false);
                setSuccessMessage("");
                fetchUsers();
                const customerRole = roles.find((r: any) => r.name === 'CUSTOMER');
                setFormData({ email: "", firstName: "", lastName: "", password: "", roleId: customerRole?.id || roles[0]?.id });
            }, 1500);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to create user");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.firstName.toLowerCase().includes(search.toLowerCase()) ||
        u.lastName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-obliq-primary italic">Users</h1>
                    <p className="text-obliq-secondary font-medium tracking-tight">Manage team members and their granular permissions.</p>
                </div>
                <PermissionGate permission="create:users">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95"
                    >
                        <UserPlus className="h-4 w-4" />
                        Add New User
                    </button>
                </PermissionGate>
            </div>

            <div className="relative group max-w-2xl">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-obliq-secondary group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="glass w-full rounded-[1.5rem] py-4 pl-12 pr-4 text-obliq-primary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-bold tracking-tight"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="glass overflow-hidden rounded-[2.5rem] border border-white/40 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-separate border-spacing-y-2 px-4">
                        <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-obliq-secondary/60">
                            <tr>
                                <th className="px-6 py-6">User Identity</th>
                                <th className="px-6 py-6">Access Role</th>
                                <th className="px-6 py-6">Status</th>
                                <th className="px-6 py-6">Registered</th>
                                <th className="px-6 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="space-y-4">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-in fade-in duration-500">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <Skeleton className="h-12 w-12 rounded-2xl" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-3 w-48" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-xl" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-10 w-10 ml-auto rounded-xl" /></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center border border-dashed border-gray-200">
                                                <Search className="h-8 w-8 text-gray-300" />
                                            </div>
                                            <p className="font-bold text-obliq-secondary italic">No users found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-white/60 transition-all rounded-3xl">
                                        <td className="px-6 py-5 rounded-l-[1.5rem]">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/10 to-accent/10 border border-primary/20 font-black text-primary text-base shadow-inner group-hover:scale-110 transition-transform">
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-obliq-primary text-base italic leading-tight">{user.firstName} {user.lastName}</span>
                                                    <span className="text-xs font-bold text-obliq-secondary tracking-tight">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="rounded-xl bg-primary/10 px-3 py-1 text-[10px] font-black text-primary uppercase tracking-widest border border-primary/20">
                                                {user.role.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "h-2 w-2 rounded-full",
                                                    user.status === 'ACTIVE' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,44,44,0.5)]"
                                                )} />
                                                <span className="text-[10px] font-black tracking-[0.2em] uppercase">{user.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 font-bold text-obliq-secondary tracking-tight">
                                            {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-5 text-right rounded-r-[1.5rem]">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <PermissionGate permission="manage:permissions">
                                                    <button
                                                        onClick={() => setSelectedUserForOverrides(user)}
                                                        className="rounded-xl bg-white p-2.5 text-obliq-secondary hover:bg-primary hover:text-white shadow-sm ring-1 ring-black/5 hover:ring-primary transition-all active:scale-95"
                                                        title="Grant Overrides"
                                                    >
                                                        <ShieldCheck className="h-5 w-5" />
                                                    </button>
                                                </PermissionGate>
                                                <PermissionGate permission="edit:users">
                                                    <button className="rounded-xl bg-white p-2.5 text-obliq-secondary hover:bg-obliq-primary hover:text-white shadow-sm ring-1 ring-black/5 hover:ring-primary transition-all active:scale-95" title="Edit Profile">
                                                        <Settings2 className="h-5 w-5" />
                                                    </button>
                                                </PermissionGate>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedUserForOverrides && (
                <OverridesModal
                    user={selectedUserForOverrides}
                    onClose={() => setSelectedUserForOverrides(null)}
                    onSuccess={() => {
                        fetchUsers();
                    }}
                />
            )}

            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="glass w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-white/40">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-obliq-primary italic tracking-tighter uppercase">Initialize User</h2>
                                <p className="text-sm font-bold text-obliq-secondary tracking-tight opacity-60">Onboarding a new member to the secure environment.</p>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="rounded-2xl p-2 text-obliq-secondary hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {successMessage ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center animate-in slide-in-from-bottom-8 duration-500">
                                <div className="h-20 w-20 rounded-[2rem] bg-green-50 flex items-center justify-center border border-green-100 shadow-inner mb-6">
                                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-black text-obliq-primary italic tracking-tight">{successMessage}</h3>
                                <p className="text-sm font-bold text-obliq-secondary mt-1">Updating global identity records...</p>
                            </div>
                        ) : (
                            <form className="mt-10 space-y-6" onSubmit={handleAddUser}>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-obliq-secondary ml-1">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full rounded-[1.25rem] border border-border bg-gray-50/50 p-4 text-sm font-bold text-obliq-primary outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-obliq-secondary ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full rounded-[1.25rem] border border-border bg-gray-50/50 p-4 text-sm font-bold text-obliq-primary outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-obliq-secondary ml-1">Secure Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full rounded-[1.25rem] border border-border bg-gray-50/50 p-4 text-sm font-bold text-obliq-primary outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-obliq-secondary ml-1">Initial Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full rounded-[1.25rem] border border-border bg-gray-50/50 p-4 text-sm font-bold text-obliq-primary outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-obliq-secondary ml-1">Primary Access Role</label>
                                    <select
                                        value={formData.roleId}
                                        onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                                        className="w-full rounded-[1.25rem] border border-border bg-gray-50/50 p-4 text-sm font-bold text-obliq-primary outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary appearance-none transition-all cursor-pointer"
                                    >
                                        {roles.filter(r => r.name !== 'ADMIN').map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name.charAt(0) + role.name.slice(1).toLowerCase()} Identity
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex w-full items-center justify-center rounded-[1.25rem] bg-primary py-5 text-xs font-black uppercase tracking-[0.25em] text-white shadow-2xl shadow-primary/30 hover:bg-primary/90 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Authorize New User"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
