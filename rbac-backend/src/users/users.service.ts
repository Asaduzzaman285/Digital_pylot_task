import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto, creatorId: string) {
        const { password, ...data } = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 12);

        return this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                managerId: data.managerId || creatorId,
            },
            include: { role: true },
        });
    }

    async findAll(managerId?: string) {
        return this.prisma.user.findMany({
            where: managerId ? { managerId } : {},
            include: { role: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                role: {
                    include: { rolePermissions: { include: { permission: true } } },
                },
                userPermissions: { include: { permission: true } },
                manager: true,
                subordinates: true,
            },
        });
        if (!user) throw new NotFoundException();
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            include: { role: true },
        });
    }
}
