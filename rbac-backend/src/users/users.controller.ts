import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard, RequirePermission } from '../common/guards/permission.guard';

import { PrismaService } from '../prisma/prisma.service';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly prisma: PrismaService,
    ) { }

    @Get('roles')
    @RequirePermission('view:users')
    getRoles() {
        return this.prisma.role.findMany();
    }

    @Post()
    @RequirePermission('create:users')
    create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
        return this.usersService.create(createUserDto, req.user.id);
    }

    @Get()
    @RequirePermission('view:users')
    findAll(@Req() req: any) {
        // Managers only see their subordinates, Admins see all
        const managerId = req.user.role.name === 'ADMIN' ? undefined : req.user.id;
        return this.usersService.findAll(managerId);
    }

    @Get(':id')
    @RequirePermission('view:users')
    async findOne(@Param('id') id: string, @Req() req: any) {
        if (req.user.role.name !== 'ADMIN') {
            const user = await this.prisma.user.findUnique({ where: { id }, select: { managerId: true } });
            if (!user || user.managerId !== req.user.id) {
                throw new ForbiddenException('Manager scope: you can only view your own team members');
            }
        }
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @RequirePermission('edit:users')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: any) {
        if (req.user.role.name !== 'ADMIN') {
            const user = await this.prisma.user.findUnique({ where: { id }, select: { managerId: true } });
            if (!user || user.managerId !== req.user.id) {
                throw new ForbiddenException('Manager scope: you can only edit your own team members');
            }
        }
        return this.usersService.update(id, updateUserDto);
    }
}
