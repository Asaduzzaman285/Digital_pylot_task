import * as express from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, res: express.Response): Promise<{
        accessToken: string;
        user: {
            role: {
                id: string;
                name: import(".prisma/client").$Enums.RoleName;
            };
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            roleId: string;
            managerId: string | null;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    refresh(req: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: any, res: express.Response): Promise<{
        message: string;
    }>;
    getMe(req: any): Promise<{
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
