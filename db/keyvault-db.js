const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

const sqlConfig = {
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    user: process.env.SQL_USER,
    port: parseInt(process.env.SQL_PORT || '1433', 10),
    options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true
    }
};

// Fetch secret from Azure Key Vault
async function getSecret(secretName) {
    const url = `https://${process.env.KEY_VAULT_NAME}.vault.azure.net`;
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(url, credential);

    const secret = await client.getSecret(secretName);
    return secret.value;
}

module.exports = { sqlConfig, getSecret };
