const express = require('express');
const router = express.Router();
const sql = require('mssql');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
    safeRender(res, 'login');
});

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const connectionString = "Server=tcp:talaosman-sqlsrv.database.windows.net,1433;Initial Catalog=TalaOsman-db;User ID=talaosman;Password=TOsman#1234;Encrypt=True";
        const pool = await sql.connect(connectionString);

        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Users WHERE email = @email');

        await pool.close();

        if (result.recordset.length === 0) {
            return safeRender(res, 'login', { error: 'Invalid email or password' });
        }

        const user = result.recordset[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return safeRender(res, 'login', { error: 'Invalid email or password' });
        }

        // Save user session
        req.session.user = { id: user.id, email: user.email };

        // ❗ Stay on login page and show success message
        return safeRender(res, 'login', { success: 'Login successful!' });

    } catch (err) {
        console.error('Login error:', err.message);
        return safeRender(res, 'login', { error: 'Server error. Please try again later.' });
    }
});

// Prevent crash render
function safeRender(res, view, data) {
    try {
        if (!res.headersSent) res.render(view, data);
    } catch (err) {
        console.error('Render failed:', err);
        res.send('Server error');
    }
}

module.exports = router;
