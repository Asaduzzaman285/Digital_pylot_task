import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GrantCeilingGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const granter = request.user;
        const { atom } = request.body;

        if (!atom) return true;

        // A granter can only grant permissions they themselves hold
        if (!granter.permissions.includes(atom)) {
            throw new ForbiddenException(`Grant ceiling: you do not hold the permission [${atom}]`);
        }

        return true;
    }
}
