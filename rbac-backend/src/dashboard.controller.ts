import { PermissionGuard, RequirePermission } from "./common/guards/permission.guard";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";

@Controller('dashboard')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class DashboardController {
    @Get('stats')
    @RequirePermission('view:dashboard')
    getStats() {
        return {
            users: 150,
            leads: 1200,
            activeTasks: 45,
            revenue: "$250,000"
        };
    }
}
