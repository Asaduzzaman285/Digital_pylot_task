import { PrismaService } from '../prisma/prisma.service';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(actorId?: string): Promise<({
        actor: {
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        actorId: string;
        action: string;
        targetType: string | null;
        targetId: string | null;
        metadata: import(".prisma/client").Prisma.JsonValue | null;
        ipAddress: string | null;
        createdAt: Date;
    })[]>;
    create(data: {
        actorId: string;
        action: string;
        targetType?: string;
        targetId?: string;
        metadata?: any;
    }): Promise<{
        id: string;
        actorId: string;
        action: string;
        targetType: string | null;
        targetId: string | null;
        metadata: import(".prisma/client").Prisma.JsonValue | null;
        ipAddress: string | null;
        createdAt: Date;
    }>;
}
