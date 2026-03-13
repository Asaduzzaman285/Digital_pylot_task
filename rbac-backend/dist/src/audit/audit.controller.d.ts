import { AuditService } from './audit.service';
export declare class AuditController {
    private auditService;
    constructor(auditService: AuditService);
    findAll(req: any): Promise<({
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
}
