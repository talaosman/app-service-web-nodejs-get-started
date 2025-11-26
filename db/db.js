const sql = require('mssql');

// HARD-CODED SQL CONFIG (because your Azure Web App does not support env vars)
const sqlConfig = {
    server: "talaosman-sqlsrv.database.windows.net",
    database: "TalaOsman-db",
    user: "talaosman",
    password: "TOsman#1234",
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true
    }
};

// Test connection when app starts
async function testConnection() {
    try {
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request().query("SELECT GETDATE() AS CurrentDateTime");

        console.log("DB Connected. Current DateTime:", result.recordset[0].CurrentDateTime);
        await pool.close();
    } catch (err) {
        console.error("DB Connection Failed:", err);
    }
}

testConnection();

module.exports = { sql, sqlConfig };
