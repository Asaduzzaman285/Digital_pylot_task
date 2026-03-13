import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class UsersController {
    private readonly usersService;
    private readonly prisma;
    constructor(usersService: UsersService, prisma: PrismaService);
    getRoles(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: import(".prisma/client").$Enums.RoleName;
    }[]>;
    create(createUserDto: CreateUserDto, req: any): Promise<{
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
    findAll(req: any): Promise<({
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
