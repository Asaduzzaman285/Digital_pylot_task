import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
            include: { role: true },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.status !== UserStatus.ACTIVE) {
            throw new ForbiddenException(`User account is ${user.status.toLowerCase()}`);
        }

        const tokens = await this.generateTokens(user.id, user.email, user.roleId);

        // Save hashed refresh token
        await this.saveRefreshToken(user.id, tokens.refreshToken);

        // Audit log
        await this.prisma.auditLog.create({
            data: {
                actorId: user.id,
                action: 'LOGIN',
            },
        });

        const { password: _, ...userWithoutPassword } = user;
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: userWithoutPassword,
        };
    }

    async generateTokens(userId: string, email: string, roleId: string) {
        const payload = { sub: userId, email, roleId };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_ACCESS_SECRET || 'secret',
                expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN as any) || '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET || 'secret',
                expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN as any) || '7d',
            }),
        ]);

        return { accessToken, refreshToken };
    }

    async saveRefreshToken(userId: string, token: string) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        await this.prisma.refreshToken.create({
            data: {
                userId,
                token: await bcrypt.hash(token, 10),
                expiresAt,
            },
        });
    }

    async logout(userId: string, refreshToken: string) {
        // Revoke tokens
        await this.prisma.refreshToken.updateMany({
            where: { userId, isRevoked: false },
            data: { isRevoked: true },
        });

        await this.prisma.auditLog.create({
            data: {
                actorId: userId,
                action: 'LOGOUT',
            },
        });
    }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                role: {
                    include: {
                        rolePermissions: { include: { permission: true } },
                    },
                },
                userPermissions: { include: { permission: true } },
            },
        });

        if (!user) throw new UnauthorizedException();

        // Resolve permissions: Role permissions + Individual overrides
        const roleAtoms = user.role.rolePermissions.map((rp) => rp.permission.atom);
        const userAtoms = user.userPermissions.map((up) => up.permission.atom);
        const resolvedPermissions = Array.from(new Set([...roleAtoms, ...userAtoms]));

        const { password: _, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            permissions: resolvedPermissions,
        };
    }
}
