const sql = require('mssql');
require('dotenv').config({ path: __dirname + '/../.env' }); // ensure correct path

// Build connection config
const sqlConfig = {
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD?.replace(/^"|"$/g, ''), // remove quotes if any
    port: parseInt(process.env.SQL_PORT, 10) || 1433,
    options: {
        encrypt: true,               // required for Azure SQL
        trustServerCertificate: false,
        enableArithAbort: true
    }
};

// Test connection function
async function testConnection() {
    try {
        // Use the config object directly
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request().query('SELECT GETDATE() AS CurrentDateTime');
        console.log('DB Connected. Current DateTime:', result.recordset[0].CurrentDateTime);
        await pool.close();
        return result.recordset[0].CurrentDateTime;
    } catch (err) {
        console.error('DB Connection Failed:', err);
        throw err;
    }
}
testConnection();

module.exports = { sql, sqlConfig, testConnection };
