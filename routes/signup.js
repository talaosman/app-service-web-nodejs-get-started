const express = require('express');
const router = express.Router();
const sql = require('mssql');
const bcrypt = require('bcryptjs');

// --- GET signup page ---
router.get('/', (req, res) => {
    safeRender(res, 'signup');
});

// --- POST signup form ---
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Use same connection string method as login
        const connectionString = "Server=tcp:talaosman-sqlsrv.database.windows.net,1433;Initial Catalog=TalaOsman-db;User ID=talaosman;Password=TOsman#1234;Encrypt=True";
        const pool = await sql.connect(connectionString);

        // Check if user already exists
        const existing = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Users WHERE email = @email');

        if (existing.recordset.length > 0) {
            await pool.close();
            return safeRender(res, 'signup', { error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await pool.request()
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, hashedPassword)
            .query('INSERT INTO Users (email, password) VALUES (@email, @password)');

        await pool.close();

        return safeRender(res, 'signup', { success: 'User registered successfully! You can now login.' });

    } catch (err) {
        console.error('Signup error:', err.message);
        return safeRender(res, 'signup', { error: 'Server error. Please try again later.' });
    }
});

// --- Safe render helper ---
function safeRender(res, view, data) {
    try {
        if (!res.headersSent) res.render(view, data);
    } catch (err) {
        console.error('Render failed:', err);
        res.send('Server error');
    }
}

module.exports = router;
