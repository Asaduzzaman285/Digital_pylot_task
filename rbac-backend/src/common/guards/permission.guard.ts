import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const PERMISSION_KEY = 'permission';
export const RequirePermission = (atom: string) => SetMetadata(PERMISSION_KEY, atom);

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredAtom = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredAtom) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        // User object populated by JwtAuthGuard should have permissions array
        if (!user || !user.permissions || !user.permissions.includes(requiredAtom)) {
            throw new ForbiddenException(`Access denied: missing permission [${requiredAtom}]`);
        }

        return true;
    }
}
