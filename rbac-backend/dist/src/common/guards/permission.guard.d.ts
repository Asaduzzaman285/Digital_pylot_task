import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare const PERMISSION_KEY = "permission";
export declare const RequirePermission: (atom: string) => import("@nestjs/common").CustomDecorator<string>;
export declare class PermissionGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
