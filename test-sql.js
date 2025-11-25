require('dotenv').config();  // <--- load .env first
console.log('KEY_VAULT_NAME:', process.env.KEY_VAULT_NAME); // debug
const sql = require('mssql');
const { getSecret } = require('./db/keyvault-db'); // your current getSecret function

async function test() {
  try {
    const connectionString = await getSecret(process.env.KEY_VAULT_DB_PASSWORD_NAME);
    console.log('Fetched connection string:', connectionString);

    const pool = await sql.connect(connectionString);
    console.log('✅ SQL Connected successfully!');

    const result = await pool.request().query('SELECT TOP 1 * FROM Users');
    console.log('Sample user:', result.recordset[0]);

    await pool.close();
  } catch (err) {
    console.error('SQL connection error:', err);
  }
}

test();
