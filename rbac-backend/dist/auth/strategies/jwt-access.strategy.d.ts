import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
declare const JwtAccessStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtAccessStrategy extends JwtAccessStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: any): Promise<{
        permissions: string[];
        role: {
            rolePermissions: ({
                permission: {
                    id: string;
                    atom: string;
                    label: string;
                    description: string | null;
                    module: string;
                };
            } & {
                id: string;
                roleId: string;
                permissionId: string;
            })[];
        } & {
            id: string;
            name: import(".prisma/client").$Enums.RoleName;
        };
        userPermissions: ({
            permission: {
                id: string;
                atom: string;
                label: string;
                description: string | null;
                module: string;
            };
        } & {
            id: string;
            userId: string;
            permissionId: string;
            grantedById: string;
            grantedAt: Date;
        })[];
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        roleId: string;
        managerId: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
