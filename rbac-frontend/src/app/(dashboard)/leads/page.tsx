"use client";
import PlaceholderPage from "@/components/layout/placeholder-page";

import { useRequirePermission } from "@/hooks/use-permissions";

export default function LeadsPage() {
    useRequirePermission("view:leads");
    return (
        <PlaceholderPage
            title="Leads Management"
            description="Track and manage potential customer opportunities."
        />
    );
}
