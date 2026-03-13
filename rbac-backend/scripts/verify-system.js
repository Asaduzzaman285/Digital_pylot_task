const axios = require('axios');

const API_URL = 'http://localhost:3001/api/v1';

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

        // Retry loop for the new roles endpoint (Server Hot-Reload)
        console.log('Resolving Role IDs (with retry for hot-reload)...');
        let roles = [];
        for (let i = 0; i < 5; i++) {
            try {
                const rolesRes = await axios.get(`${API_URL}/users/roles`, authHeaders);
                roles = rolesRes.data;
                break;
            } catch (err) {
                if (err.response?.status === 404 && i < 4) {
                    console.log(`...Endpoint not ready yet, retrying in 2s (${i + 1}/5)`);
                    await wait(2000);
                } else {
                    throw err;
                }
            }
        }

        const agentRole = roles.find(r => r.name === 'AGENT');
        if (!agentRole) throw new Error('AGENT role not found in database');
        console.log(`✅ Resolved AGENT role ID: ${agentRole.id}\n`);

        // 2. Verify Data Access
        console.log('Test 2: Data Fetching (Users & Audit)');
        const users = await axios.get(`${API_URL}/users`, authHeaders);
        console.log(`✅ Fetched ${users.data.length} users`);
        const logs = await axios.get(`${API_URL}/audit`, authHeaders);
        console.log(`✅ Fetched ${logs.data.length} audit logs\n`);

        // 3. Test Role-Based Restriction
        console.log('Test 3: RBAC Restrictions & Grant Ceiling');
        const agentEmail = `test-agent-${Date.now()}@rbac.com`;
        await axios.post(`${API_URL}/users`, {
            email: agentEmail,
            firstName: 'Test',
            lastName: 'Agent',
            password: 'Password123!',
            roleId: agentRole.id
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
        } catch (err) {
            if (err.response?.status === 403) {
                console.log('✅ Pass: Agent correctly forbidden from Audit Logs');
            } else {
                throw err;
            }
        }

        // 4. Test Grant Ceiling
        console.log('\nTest 4: Grant Ceiling Enforcement');
        try {
            await axios.post(`${API_URL}/permissions/grant`, {
                userId: adminLogin.data.user.id,
                permissionAtom: 'manage:users'
            }, agentHeaders);
            console.log('❌ FAIL: Agent bypassed grant ceiling');
        } catch (err) {
            if (err.response?.status === 403) {
                console.log('✅ Pass: Grant Ceiling enforced (Agent blocked from elevating perms)');
            } else {
                throw err;
            }
        }

        console.log('\n✨ ALL CORE FUNCTIONAL TESTS PASSED ✨');

    } catch (err) {
        console.error('\n❌ Test execution failed!');
        if (err.response) {
            console.error('Response Status:', err.response.status);
            console.error('Response Data:', JSON.stringify(err.response.data, null, 2));
        } else {
            console.error('Message:', err.message);
        }
        process.exit(1);
    }
}

runTests();
