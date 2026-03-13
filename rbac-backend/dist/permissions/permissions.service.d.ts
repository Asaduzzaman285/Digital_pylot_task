import { PrismaService } from '../prisma/prisma.service';
export declare class PermissionsService {
    private prisma;
    constructor(prisma: PrismaService);
    resolveUserPermissions(userId: string): Promise<string[]>;
    findAll(): Promise<{
        id: string;
        atom: string;
        label: string;
        description: string | null;
        module: string;
    }[]>;
}
