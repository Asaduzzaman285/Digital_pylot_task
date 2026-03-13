import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    async findAll(actorId?: string) {
        return this.prisma.auditLog.findMany({
            where: actorId ? { actorId } : {},
            include: { actor: { select: { email: true, firstName: true, lastName: true } } },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }

    async create(data: { actorId: string; action: string; targetType?: string; targetId?: string; metadata?: any }) {
        return this.prisma.auditLog.create({ data });
    }
}
