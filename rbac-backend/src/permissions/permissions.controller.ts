import { Controller, Get, Post, Body, Delete, UseGuards, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { GrantPermissionDto, RevokePermissionDto } from './dto/permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard, RequirePermission } from '../common/guards/permission.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PermissionsController {
    constructor(
        private readonly permissionsService: PermissionsService,
        private readonly prisma: PrismaService,
    ) { }

    @Get()
    @RequirePermission('view:permissions')
    findAll() {
        return this.permissionsService.findAll();
    }

    @Post('grant')
    @RequirePermission('manage:permissions')
    async grant(@Body() dto: GrantPermissionDto, @Req() req: any) {
        // 1. Grant Ceiling: Can only grant what you have
        if (!req.user.permissions.includes(dto.permissionAtom)) {
            throw new ForbiddenException(`Grant ceiling: you do not hold permission [${dto.permissionAtom}]`);
        }

        const permission = await this.prisma.permission.findUnique({
            where: { atom: dto.permissionAtom },
        });

        if (!permission) {
            throw new NotFoundException(`Permission [${dto.permissionAtom}] not found`);
        }

        return this.prisma.userPermission.upsert({
            where: {
                userId_permissionId: {
                    userId: dto.userId,
                    permissionId: permission.id,
                },
            },
            update: {
                grantedById: req.user.id,
            },
            create: {
                userId: dto.userId,
                permissionId: permission.id,
                grantedById: req.user.id,
            },
        });
    }

    @Delete('revoke')
    @RequirePermission('manage:permissions')
    async revoke(@Body() dto: RevokePermissionDto) {
        const permission = await this.prisma.permission.findUnique({
            where: { atom: dto.permissionAtom },
        });

        if (!permission) {
            throw new NotFoundException(`Permission [${dto.permissionAtom}] not found`);
        }

        return this.prisma.userPermission.delete({
            where: {
                userId_permissionId: {
                    userId: dto.userId,
                    permissionId: permission.id,
                },
            },
        });
    }
}
