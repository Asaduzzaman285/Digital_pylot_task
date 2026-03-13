import { PrismaService } from '../prisma/prisma.service';
export declare class RolesController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: import(".prisma/client").$Enums.RoleName;
    }[]>;
}
