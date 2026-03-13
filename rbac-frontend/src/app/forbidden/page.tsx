"use client";

import { usePermissions } from "@/hooks/use-permissions";

export default function ForbiddenPage() {
    const { isAdmin } = usePermissions();

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="rounded-full bg-red-50 p-6 text-red-600">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            </div>
            <h1 className="mt-6 text-3xl font-bold text-obliq-primary">403 - Forbidden</h1>
            <p className="mt-2 text-obliq-secondary">
                You do not have the necessary permissions to access this page.
            </p>
            <div className="mt-8">
                <button
                    onClick={() => window.location.href = "/dashboard"}
                    className="rounded-lg bg-obliq-primary px-6 py-2 text-sm font-semibold text-white hover:bg-black transition-colors"
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
}
