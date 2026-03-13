"use client";

import PlaceholderModule from "@/components/ui/placeholder-module";
import { useRequirePermission } from "@/hooks/use-permissions";

export default function SettingsPage() {
    useRequirePermission("view:settings");
    return <PlaceholderModule title="System Settings" />;
}
