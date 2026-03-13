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
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @RequirePermission('edit:users')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
}
