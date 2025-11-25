const express = require('express');
const router = express.Router();
const { sql, sqlConfig } = require('../db/db');

// Test endpoint
router.get('/test-db', async (req, res) => {
    try {
        // Connect using sqlConfig object
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request().query('SELECT GETDATE() AS CurrentDateTime');
        await pool.close();

        res.json({ success: true, currentDateTime: result.recordset[0].CurrentDateTime });
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
