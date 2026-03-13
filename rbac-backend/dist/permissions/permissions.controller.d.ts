import { PermissionsService } from './permissions.service';
import { GrantPermissionDto, RevokePermissionDto } from './dto/permission.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class PermissionsController {
    private readonly permissionsService;
    private readonly prisma;
    constructor(permissionsService: PermissionsService, prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        atom: string;
        label: string;
        description: string | null;
        module: string;
    }[]>;
    grant(dto: GrantPermissionDto, req: any): Promise<{
        id: string;
        userId: string;
        permissionId: string;
        grantedById: string;
        grantedAt: Date;
    }>;
    revoke(dto: RevokePermissionDto): Promise<{
        id: string;
        userId: string;
        permissionId: string;
        grantedById: string;
        grantedAt: Date;
    }>;
}
