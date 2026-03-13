import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: (req: Request) => {
                return req.cookies?.['refreshToken'];
            },
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_SECRET || 'secret',
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any) {
        const refreshToken = req.cookies?.['refreshToken'];
        if (!refreshToken) throw new UnauthorizedException();

        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });

        if (!user || user.status !== 'ACTIVE') throw new UnauthorizedException();

        // Verify hashed token in DB
        const savedTokens = await this.prisma.refreshToken.findMany({
            where: { userId: user.id, isRevoked: false },
        });

        let isValid = false;
        for (const saved of savedTokens) {
            if (await bcrypt.compare(refreshToken, saved.token)) {
                isValid = true;
                break;
            }
        }

        if (!isValid) throw new UnauthorizedException();

        return { id: user.id, email: user.email, roleId: user.roleId };
    }
}
