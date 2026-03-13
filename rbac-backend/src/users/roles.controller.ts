import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard, RequirePermission } from '../common/guards/permission.guard';

@Controller('users/roles')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class RolesController {
    constructor(private readonly prisma: PrismaService) { }

    @Get()
    @RequirePermission('view:users')
    findAll() {
        return this.prisma.role.findMany();
    }
}
