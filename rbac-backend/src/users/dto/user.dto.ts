import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    roleId: string;

    @IsString()
    @IsOptional()
    managerId?: string;

    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string;
}

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsEnum(UserStatus)
    @IsOptional()
    status?: UserStatus;

    @IsString()
    @IsOptional()
    roleId?: string;
}
