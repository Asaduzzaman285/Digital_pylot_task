import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
    constructor(private prisma: PrismaService) { }

    async resolveUserPermissions(userId: string): Promise<string[]> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                role: {
                    include: {
                        rolePermissions: {
                            include: { permission: true },
                        },
                    },
                },
                userPermissions: {
                    include: { permission: true },
                },
            },
        });

        if (!user) return [];

        // Role permissions (defaults)
        const roleAtoms = user.role.rolePermissions.map((rp) => rp.permission.atom);

        // User permissions (overrides/additions)
        const userAtoms = user.userPermissions.map((up) => up.permission.atom);

        // Merge and return unique atoms
        return Array.from(new Set([...roleAtoms, ...userAtoms]));
    }

    async findAll() {
        return this.prisma.permission.findMany({
            orderBy: { module: 'asc' },
        });
    }
}
