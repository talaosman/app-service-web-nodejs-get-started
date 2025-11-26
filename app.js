require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const apiRouter = require('./routes/api');
const loginRouter = require('./routes/login');
const routes = require('./routes/index');
const users = require('./routes/users');
const signupRouter = require('./routes/signup');

const app = express();


// --- View engine setup ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); // or pug if you change templates

// --- Middleware ---
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: false
}));

// --- Serve static files correctly ---
app.use(express.static(path.join(__dirname, 'public')));

// --- Routes ---
// app.use('/signup', signupRouter); 
app.use('/login', loginRouter);
app.use('/api', apiRouter);
app.use('/users', users);
app.use('/', routes);              // ROOT MUST BE LAST!


app.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.send(`Welcome ${req.session.user.email}`);
});

// --- 404 handler ---
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// --- Error handlers ---
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', { message: err.message, error: err });
    });
} else {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', { message: err.message, error: {} });
    });
}

module.exports = app;
