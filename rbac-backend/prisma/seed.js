"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const roles = await Promise.all(Object.values(client_1.RoleName).map((name) => prisma.role.upsert({
        where: { name },
        update: {},
        create: { name },
    })));
    const adminRole = roles.find((r) => r.name === client_1.RoleName.ADMIN);
    const managerRole = roles.find((r) => r.name === client_1.RoleName.MANAGER);
    const agentRole = roles.find((r) => r.name === client_1.RoleName.AGENT);
    const customerRole = roles.find((r) => r.name === client_1.RoleName.CUSTOMER);
    const permissionsData = [
        { atom: 'view:dashboard', label: 'View Dashboard', module: 'Dashboard' },
        { atom: 'view:users', label: 'View Users', module: 'Users' },
        { atom: 'create:users', label: 'Create Users', module: 'Users' },
        { atom: 'edit:users', label: 'Edit Users', module: 'Users' },
        { atom: 'delete:users', label: 'Delete Users', module: 'Users' },
        { atom: 'view:leads', label: 'View Leads', module: 'Leads' },
        { atom: 'create:leads', label: 'Create Leads', module: 'Leads' },
        { atom: 'edit:leads', label: 'Edit Leads', module: 'Leads' },
        { atom: 'delete:leads', label: 'Delete Leads', module: 'Leads' },
        { atom: 'view:tasks', label: 'View Tasks', module: 'Tasks' },
        { atom: 'create:tasks', label: 'Create Tasks', module: 'Tasks' },
        { atom: 'edit:tasks', label: 'Edit Tasks', module: 'Tasks' },
        { atom: 'delete:tasks', label: 'Delete Tasks', module: 'Tasks' },
        { atom: 'view:reports', label: 'View Reports', module: 'Reports' },
        { atom: 'export:reports', label: 'Export Reports', module: 'Reports' },
        { atom: 'view:audit-log', label: 'View Audit Log', module: 'Audit Log' },
        { atom: 'view:settings', label: 'View Settings', module: 'Settings' },
        { atom: 'edit:settings', label: 'Edit Settings', module: 'Settings' },
        { atom: 'view:customer-portal', label: 'View Customer Portal', module: 'Customer Portal' },
        { atom: 'view:permissions', label: 'View Permissions', module: 'Permissions' },
        { atom: 'manage:permissions', label: 'Manage Permissions', module: 'Permissions' },
    ];
    const permissions = await Promise.all(permissionsData.map((p) => prisma.permission.upsert({
        where: { atom: p.atom },
        update: { label: p.label, module: p.module },
        create: p,
    })));
    const adminPerms = permissions;
    const managerPerms = permissions.filter((p) => !['delete:users', 'edit:settings'].includes(p.atom));
    const agentPerms = permissions.filter((p) => ['view:dashboard', 'view:leads', 'view:tasks'].includes(p.atom));
    const customerPerms = permissions.filter((p) => ['view:customer-portal'].includes(p.atom));
    const assignRolePerms = async (roleId, perms) => {
        for (const p of perms) {
            await prisma.rolePermission.upsert({
                where: { roleId_permissionId: { roleId, permissionId: p.id } },
                update: {},
                create: { roleId, permissionId: p.id },
            });
        }
    };
    await assignRolePerms(adminRole.id, adminPerms);
    await assignRolePerms(managerRole.id, managerPerms);
    await assignRolePerms(agentRole.id, agentPerms);
    await assignRolePerms(customerRole.id, customerPerms);
    const password = await bcrypt.hash('Admin@123456', 12);
    const managerPassword = await bcrypt.hash('Manager@123456', 12);
    const agentPassword = await bcrypt.hash('Agent@123456', 12);
    const customerPassword = await bcrypt.hash('Customer@123456', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@rbac.com' },
        update: {},
        create: {
            email: 'admin@rbac.com',
            password,
            firstName: 'System',
            lastName: 'Admin',
            roleId: adminRole.id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const manager = await prisma.user.upsert({
        where: { email: 'manager@rbac.com' },
        update: {},
        create: {
            email: 'manager@rbac.com',
            password: managerPassword,
            firstName: 'Team',
            lastName: 'Manager',
            roleId: managerRole.id,
            managerId: admin.id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const agent = await prisma.user.upsert({
        where: { email: 'agent@rbac.com' },
        update: {},
        create: {
            email: 'agent@rbac.com',
            password: agentPassword,
            firstName: 'Field',
            lastName: 'Agent',
            roleId: agentRole.id,
            managerId: manager.id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const customer = await prisma.user.upsert({
        where: { email: 'customer@rbac.com' },
        update: {},
        create: {
            email: 'customer@rbac.com',
            password: customerPassword,
            firstName: 'Loyal',
            lastName: 'Customer',
            roleId: customerRole.id,
            managerId: manager.id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    console.log('Seed data created successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map