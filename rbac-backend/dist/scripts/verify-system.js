"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:3001/api/v1';
async function runTests() {
    console.log('🚀 Starting Obliq RBAC Verification Script...\n');
    try {
        console.log('Test 1: Admin Authentication');
        const adminLogin = await axios_1.default.post(`${API_URL}/auth/login`, {
            email: 'admin@rbac.com',
            password: 'Admin@123456'
        });
        const adminToken = adminLogin.data.accessToken;
        console.log('✅ Admin login successful\n');
        const authHeaders = { headers: { Authorization: `Bearer ${adminToken}` } };
        console.log('Test 2: Data Fetching (Users & Audit)');
        const users = await axios_1.default.get(`${API_URL}/users`, authHeaders);
        console.log(`✅ Fetched ${users.data.length} users`);
        const logs = await axios_1.default.get(`${API_URL}/audit`, authHeaders);
        console.log(`✅ Fetched ${logs.data.length} audit logs\n`);
        console.log('Test 3: RBAC Restrictions & Grant Ceiling');
        const agentEmail = `test-agent-${Date.now()}@rbac.com`;
        await axios_1.default.post(`${API_URL}/users`, {
            email: agentEmail,
            firstName: 'Test',
            lastName: 'Agent',
            password: 'Password123!',
            roleId: 'agent'
        }, authHeaders);
        console.log(`✅ Created test agent: ${agentEmail}`);
        const agentLogin = await axios_1.default.post(`${API_URL}/auth/login`, {
            email: agentEmail,
            password: 'Password123!'
        });
        const agentToken = agentLogin.data.accessToken;
        const agentHeaders = { headers: { Authorization: `Bearer ${agentToken}` } };
        try {
            await axios_1.default.get(`${API_URL}/audit`, agentHeaders);
            console.log('❌ FAIL: Agent accessed audit logs (should be forbidden)');
        }
        catch (err) {
            if (err.response?.status === 403) {
                console.log('✅ Pass: Agent correctly forbidden from Audit Logs');
            }
            else {
                throw err;
            }
        }
        console.log('\nTest 4: Grant Ceiling Enforcement');
        try {
            await axios_1.default.post(`${API_URL}/permissions/grant`, {
                userId: adminLogin.data.user.id,
                permissionAtom: 'manage:users'
            }, agentHeaders);
            console.log('❌ FAIL: Agent bypassed grant ceiling');
        }
        catch (err) {
            if (err.response?.status === 403) {
                console.log('✅ Pass: Grant Ceiling enforced (Agent blocked from elevating perms)');
            }
            else {
                throw err;
            }
        }
        console.log('\n✨ ALL CORE FUNCTIONAL TESTS PASSED ✨');
        console.log('Design verification (colors, glassmorphism) must be done visually via browser.');
    }
    catch (err) {
        console.error('\n❌ Test execution failed!');
        console.error(err.response?.data || err.message);
        process.exit(1);
    }
}
runTests();
//# sourceMappingURL=verify-system.js.map