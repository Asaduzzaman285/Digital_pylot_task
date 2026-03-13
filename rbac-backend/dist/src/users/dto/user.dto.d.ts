import { UserStatus } from '@prisma/client';
export declare class CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    roleId: string;
    managerId?: string;
    password: string;
}
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    status?: UserStatus;
    roleId?: string;
}
