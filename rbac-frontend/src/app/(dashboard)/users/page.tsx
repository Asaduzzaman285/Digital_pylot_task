"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { PermissionGate } from "@/components/layout/permission-gate";
import { Plus, Settings2, ShieldCheck, UserPlus, Search, X, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { OverridesModal } from "@/components/modals/overrides-modal";

export default function UsersPage() {
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
        roleId: "customer", // Default role
    });

    useEffect(() => {
        fetchUsers();
    }, []);

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
            setTimeout(() => {
                setIsAddModalOpen(false);
                setSuccessMessage("");
                fetchUsers();
                setFormData({ email: "", firstName: "", lastName: "", password: "", roleId: "customer" });
            }, 1500);
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to create user");
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
                    <h1 className="text-3xl font-bold tracking-tight text-obliq-primary">Users</h1>
                    <p className="text-obliq-secondary font-medium">Manage team members and their permissions.</p>
                </div>
                <PermissionGate permission="create:users">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95"
                    >
                        <UserPlus className="h-5 w-5" />
                        Add User
                    </button>
                </PermissionGate>
            </div>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-obliq-secondary group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="glass w-full rounded-2xl py-4 pl-12 pr-4 text-obliq-primary outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="glass overflow-hidden rounded-[2rem] p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-separate border-spacing-y-2">
                        <thead className="text-xs font-black uppercase tracking-widest text-obliq-secondary">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="space-y-4">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            <span className="font-bold text-obliq-secondary uppercase tracking-widest">Loading Records...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center font-bold text-obliq-secondary italic">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-white/50 transition-all">
                                        <td className="px-6 py-4 rounded-l-2xl">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/10 to-accent/10 border border-primary/20 font-black text-primary text-base">
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-obliq-primary text-base">{user.firstName} {user.lastName}</span>
                                                    <span className="text-xs font-bold text-obliq-secondary tracking-tight">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="rounded-xl bg-primary/10 px-3 py-1 text-xs font-black text-primary uppercase tracking-wider">
                                                {user.role.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "h-2 w-2 rounded-full",
                                                    user.status === 'ACTIVE' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,44,44,0.5)]"
                                                )} />
                                                <span className="text-xs font-black tracking-widest">{user.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-obliq-secondary">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right rounded-r-2xl">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <PermissionGate permission="manage:permissions">
                                                    <button
                                                        onClick={() => setSelectedUserForOverrides(user)}
                                                        className="rounded-xl bg-white p-2 text-obliq-secondary hover:bg-primary hover:text-white shadow-sm transition-all"
                                                        title="Grant Overrides"
                                                    >
                                                        <ShieldCheck className="h-5 w-5" />
                                                    </button>
                                                </PermissionGate>
                                                <PermissionGate permission="edit:users">
                                                    <button className="rounded-xl bg-white p-2 text-obliq-secondary hover:bg-obliq-primary hover:text-white shadow-sm transition-all" title="Edit Profile">
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

            {/* Overrides Modal */}
            {selectedUserForOverrides && (
                <OverridesModal
                    user={selectedUserForOverrides}
                    onClose={() => setSelectedUserForOverrides(null)}
                    onSuccess={() => {
                        fetchUsers();
                    }}
                />
            )}

            {/* Add User Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="glass w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-obliq-primary italic">Create New User</h2>
                                <p className="text-sm font-medium text-obliq-secondary tracking-tight">Add a new member to the organization.</p>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="rounded-2xl p-2 text-obliq-secondary hover:bg-primary/10 hover:text-primary transition-all"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {successMessage ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center animate-in slide-in-from-bottom-4 duration-300">
                                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                                <h3 className="text-xl font-bold text-obliq-primary">{successMessage}</h3>
                                <p className="text-sm text-obliq-secondary mt-1">Updating team directory...</p>
                            </div>
                        ) : (
                            <form className="mt-8 space-y-5" onSubmit={handleAddUser}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-black uppercase tracking-widest text-obliq-secondary ml-1">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full rounded-2xl border border-border bg-gray-50 p-3 text-sm font-bold text-obliq-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-black uppercase tracking-widest text-obliq-secondary ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full rounded-2xl border border-border bg-gray-50 p-3 text-sm font-bold text-obliq-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-obliq-secondary ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full rounded-2xl border border-border bg-gray-50 p-3 text-sm font-bold text-obliq-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-obliq-secondary ml-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full rounded-2xl border border-border bg-gray-50 p-3 text-sm font-bold text-obliq-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-obliq-secondary ml-1">Assigned Role</label>
                                    <select
                                        value={formData.roleId}
                                        onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                                        className="w-full rounded-2xl border border-border bg-gray-50 p-3 text-sm font-bold text-obliq-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all"
                                    >
                                        <option value="manager">Manager</option>
                                        <option value="agent">Agent</option>
                                        <option value="customer">Customer</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex w-full items-center justify-center rounded-2xl bg-primary py-4 text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Confirm & Create User"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
