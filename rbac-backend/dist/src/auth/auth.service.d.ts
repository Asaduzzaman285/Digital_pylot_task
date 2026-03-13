import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            role: {
                id: string;
                name: import("@prisma/client").$Enums.RoleName;
            };
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            roleId: string;
            managerId: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    generateTokens(userId: string, email: string, roleId: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    saveRefreshToken(userId: string, token: string): Promise<void>;
    logout(userId: string, refreshToken: string): Promise<void>;
    getProfile(userId: string): Promise<{
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
            name: import("@prisma/client").$Enums.RoleName;
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
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
