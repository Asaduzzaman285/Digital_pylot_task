import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard, RequirePermission } from '../common/guards/permission.guard';

@Controller('audit')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AuditController {
    constructor(private auditService: AuditService) { }

    @Get()
    @RequirePermission('view:audit-log')
    findAll(@Req() req: any) {
        // Admins see all, others see their own (if they have permission to view audit logs, which they might for their own actions)
        const actorId = req.user.role.name === 'ADMIN' ? undefined : req.user.id;
        return this.auditService.findAll(actorId);
    }
}
