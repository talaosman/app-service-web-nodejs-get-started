require('dotenv').config();
const { getSecret } = require('./db/keyvault-db');

async function testKeyVault() {
    try {
        const val = await getSecret(process.env.KEY_VAULT_DB_PASSWORD_NAME);
        console.log('Secret fetched:', val);
    } catch (err) {
        console.error('Error fetching secret:', err.message);
    }
}

testKeyVault();
