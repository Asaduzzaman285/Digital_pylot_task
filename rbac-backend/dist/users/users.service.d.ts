import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto, creatorId: string): Promise<{
        role: {
            id: string;
            name: import(".prisma/client").$Enums.RoleName;
        };
    } & {
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        roleId: string;
        managerId: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(managerId?: string): Promise<({
        role: {
            id: string;
            name: import(".prisma/client").$Enums.RoleName;
        };
    } & {
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        roleId: string;
        managerId: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
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
        manager: {
            id: string;
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            roleId: string;
            managerId: string | null;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        subordinates: {
            id: string;
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            roleId: string;
            managerId: string | null;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        }[];
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
    } & {
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        roleId: string;
        managerId: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        role: {
            id: string;
            name: import(".prisma/client").$Enums.RoleName;
        };
    } & {
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        roleId: string;
        managerId: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
