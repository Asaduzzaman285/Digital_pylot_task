"use client";
import PlaceholderPage from "@/components/layout/placeholder-page";

import { useRequirePermission } from "@/hooks/use-permissions";

export default function TasksPage() {
    useRequirePermission("view:tasks");
    return (
        <PlaceholderPage
            title="Tasks"
            description="Assigned activities and operational objectives."
        />
    );
}
