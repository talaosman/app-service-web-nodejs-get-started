const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { sql, sqlConfig } = require('../db/db');

// GET Signup Page
router.get('/', (req, res) => {
    safeRender(res, 'signup');
});

// POST Signup
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const pool = await sql.connect(sqlConfig);

        const existing = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Users WHERE email = @email');

        if (existing.recordset.length > 0) {
            await pool.close();
            return safeRender(res, 'signup', { error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.request()
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, hashedPassword)
            .query('INSERT INTO Users (email, password) VALUES (@email, @password)');

        await pool.close();

        return safeRender(res, 'signup', { success: 'User registered successfully!' });

    } catch (err) {
        console.error("Signup error:", err.message);
        return safeRender(res, 'signup', { error: 'Server error. Try later.' });
    }
});

// Safe render
function safeRender(res, view, data) {
    try {
        if (!res.headersSent) res.render(view, data);
    } catch (err) {
        console.error("Render error:", err);
        res.send("Server error");
    }
}

module.exports = router;
