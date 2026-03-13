"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcryptjs");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
            include: { role: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.status !== client_1.UserStatus.ACTIVE) {
            throw new common_1.ForbiddenException(`User account is ${user.status.toLowerCase()}`);
        }
        const tokens = await this.generateTokens(user.id, user.email, user.roleId);
        await this.saveRefreshToken(user.id, tokens.refreshToken);
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
    async generateTokens(userId, email, roleId) {
        const payload = { sub: userId, email, roleId };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_ACCESS_SECRET || 'secret',
                expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET || 'secret',
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async saveRefreshToken(userId, token) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.refreshToken.create({
            data: {
                userId,
                token: await bcrypt.hash(token, 10),
                expiresAt,
            },
        });
    }
    async logout(userId, refreshToken) {
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
    async getProfile(userId) {
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
        if (!user)
            throw new common_1.UnauthorizedException();
        const roleAtoms = user.role.rolePermissions.map((rp) => rp.permission.atom);
        const userAtoms = user.userPermissions.map((up) => up.permission.atom);
        const resolvedPermissions = Array.from(new Set([...roleAtoms, ...userAtoms]));
        const { password: _, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            permissions: resolvedPermissions,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map