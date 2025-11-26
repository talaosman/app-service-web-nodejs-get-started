const sql = require('mssql');
const { DefaultAzureCredential } = require('@azure/identity'); 
const { SecretClient } = require('@azure/keyvault-secrets');

async function getSecret(secretName) {
    const url = `https://${process.env.KEY_VAULT_NAME}.vault.azure.net`;
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(url, credential);
    const secret = await client.getSecret(secretName);
    return secret.value;
}

// Build SQL config dynamically after fetching secrets
async function getSqlConfig() {
    const server = await getSecret('SQL_SERVER');
    const database = await getSecret('SQL_DATABASE');
    const user = await getSecret('SQL_USER');
    const password = await getSecret('SQL_PASSWORD');

    return {
        server,
        database,
        user,
        password,
        port: 1433,
        options: {
            encrypt: true,
            trustServerCertificate: true, // for Azure App Service testing
            enableArithAbort: true
        }
    };
}

// Test connection
async function testConnection() {
    try {
        const sqlConfig = await getSqlConfig();
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request().query('SELECT GETDATE() AS CurrentDateTime');
        console.log('DB Connected. Current DateTime:', result.recordset[0].CurrentDateTime);
        await pool.close();
    } catch (err) {
        console.error('DB Connection Failed:', err);
        throw err;
    }
}

module.exports = { getSqlConfig, testConnection };
