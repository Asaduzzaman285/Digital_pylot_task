import { IsString, IsNotEmpty } from 'class-validator';

export class GrantPermissionDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    permissionAtom: string;
}

export class RevokePermissionDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    permissionAtom: string;
}
