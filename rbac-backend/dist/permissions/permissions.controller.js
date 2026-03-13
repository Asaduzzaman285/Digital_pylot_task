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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsController = void 0;
const common_1 = require("@nestjs/common");
const permissions_service_1 = require("./permissions.service");
const permission_dto_1 = require("./dto/permission.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permission_guard_1 = require("../common/guards/permission.guard");
const prisma_service_1 = require("../prisma/prisma.service");
let PermissionsController = class PermissionsController {
    constructor(permissionsService, prisma) {
        this.permissionsService = permissionsService;
        this.prisma = prisma;
    }
    findAll() {
        return this.permissionsService.findAll();
    }
    async grant(dto, req) {
        if (!req.user.permissions.includes(dto.permissionAtom)) {
            throw new common_1.ForbiddenException(`Grant ceiling: you do not hold permission [${dto.permissionAtom}]`);
        }
        const permission = await this.prisma.permission.findUnique({
            where: { atom: dto.permissionAtom },
        });
        if (!permission) {
            throw new common_1.NotFoundException(`Permission [${dto.permissionAtom}] not found`);
        }
        return this.prisma.userPermission.upsert({
            where: {
                userId_permissionId: {
                    userId: dto.userId,
                    permissionId: permission.id,
                },
            },
            update: {
                grantedById: req.user.id,
            },
            create: {
                userId: dto.userId,
                permissionId: permission.id,
                grantedById: req.user.id,
            },
        });
    }
    async revoke(dto) {
        const permission = await this.prisma.permission.findUnique({
            where: { atom: dto.permissionAtom },
        });
        if (!permission) {
            throw new common_1.NotFoundException(`Permission [${dto.permissionAtom}] not found`);
        }
        return this.prisma.userPermission.delete({
            where: {
                userId_permissionId: {
                    userId: dto.userId,
                    permissionId: permission.id,
                },
            },
        });
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.Get)(),
    (0, permission_guard_1.RequirePermission)('view:permissions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('grant'),
    (0, permission_guard_1.RequirePermission)('manage:permissions'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [permission_dto_1.GrantPermissionDto, Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "grant", null);
__decorate([
    (0, common_1.Delete)('revoke'),
    (0, permission_guard_1.RequirePermission)('manage:permissions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [permission_dto_1.RevokePermissionDto]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "revoke", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, common_1.Controller)('permissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [permissions_service_1.PermissionsService,
        prisma_service_1.PrismaService])
], PermissionsController);
//# sourceMappingURL=permissions.controller.js.map