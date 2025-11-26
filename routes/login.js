const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { sql, sqlConfig } = require('../db/db');

// GET Login Page
router.get('/', (req, res) => {
    safeRender(res, 'login');
});

// POST Login
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const pool = await sql.connect(sqlConfig);

        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Users WHERE email = @email');

        await pool.close();

        if (result.recordset.length === 0) {
            return safeRender(res, 'login', { error: 'Invalid email or password' });
        }

        const user = result.recordset[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return safeRender(res, 'login', { error: 'Invalid email or password' });
        }

        req.session.user = { id: user.id, email: user.email };

        return safeRender(res, 'login', { success: 'Login successful!' });

    } catch (err) {
        console.error("Login error:", err.message);
        return safeRender(res, 'login', { error: 'Server error. Try later.' });
    }
});

// Safe render
function safeRender(res, view, data) {
    try {
        if (!res.headersSent) res.render(view, data);
    } catch (err) {
        console.error("Render failed:", err);
        res.send("Server error");
    }
}

module.exports = router;
