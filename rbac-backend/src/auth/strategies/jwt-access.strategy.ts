import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_SECRET || 'secret',
        });
    }

    async validate(payload: any) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: {
                role: {
                    include: {
                        rolePermissions: { include: { permission: true } },
                    },
                },
                userPermissions: { include: { permission: true } },
            },
        });

        if (!user || user.status !== 'ACTIVE') {
            throw new UnauthorizedException();
        }

        const { password, ...rest } = user;

        // Resolve permissions for the request.user object
        const roleAtoms = user.role.rolePermissions.map((rp) => rp.permission.atom);
        const userAtoms = user.userPermissions.map((up) => up.permission.atom);
        const permissions = Array.from(new Set([...roleAtoms, ...userAtoms]));

        return { ...rest, permissions };
    }
}
