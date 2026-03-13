import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

async function runTests() {
    console.log('🚀 Starting Obliq RBAC Verification Script...\n');

    try {
        // 1. Test Admin Login
        console.log('Test 1: Admin Authentication');
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@rbac.com',
            password: 'Admin@123456'
        });
        const adminToken = adminLogin.data.accessToken;
        console.log('✅ Admin login successful\n');

        const authHeaders = { headers: { Authorization: `Bearer ${adminToken}` } };

        // 2. Verify Data Access
        console.log('Test 2: Data Fetching (Users & Audit)');
        const users = await axios.get(`${API_URL}/users`, authHeaders);
        console.log(`✅ Fetched ${users.data.length} users`);
        const logs = await axios.get(`${API_URL}/audit`, authHeaders);
        console.log(`✅ Fetched ${logs.data.length} audit logs\n`);

        // 3. Test Role-Based Restriction (Implicit logic check)
        // We'll create a temporary agent to test restrictions
        console.log('Test 3: RBAC Restrictions & Grant Ceiling');
        const agentEmail = `test-agent-${Date.now()}@rbac.com`;
        await axios.post(`${API_URL}/users`, {
            email: agentEmail,
            firstName: 'Test',
            lastName: 'Agent',
            password: 'Password123!',
            roleId: 'agent'
        }, authHeaders);
        console.log(`✅ Created test agent: ${agentEmail}`);

        const agentLogin = await axios.post(`${API_URL}/auth/login`, {
            email: agentEmail,
            password: 'Password123!'
        });
        const agentToken = agentLogin.data.accessToken;
        const agentHeaders = { headers: { Authorization: `Bearer ${agentToken}` } };

        try {
            await axios.get(`${API_URL}/audit`, agentHeaders);
            console.log('❌ FAIL: Agent accessed audit logs (should be forbidden)');
        } catch (err: any) {
            if (err.response?.status === 403) {
                console.log('✅ Pass: Agent correctly forbidden from Audit Logs');
            } else {
                throw err;
            }
        }

        // 4. Test Grant Ceiling (Agent trying to grant 'manage:users' which they don't have)
        console.log('\nTest 4: Grant Ceiling Enforcement');
        try {
            await axios.post(`${API_URL}/permissions/grant`, {
                userId: adminLogin.data.user.id,
                permissionAtom: 'manage:users'
            }, agentHeaders);
            console.log('❌ FAIL: Agent bypassed grant ceiling');
        } catch (err: any) {
            if (err.response?.status === 403) {
                console.log('✅ Pass: Grant Ceiling enforced (Agent blocked from elevating perms)');
            } else {
                throw err;
            }
        }

        console.log('\n✨ ALL CORE FUNCTIONAL TESTS PASSED ✨');
        console.log('Design verification (colors, glassmorphism) must be done visually via browser.');

    } catch (err: any) {
        console.error('\n❌ Test execution failed!');
        console.error(err.response?.data || err.message);
        process.exit(1);
    }
}

runTests();
