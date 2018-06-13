'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');
// const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');


// Load dotenv
dotenv.load('./env');


// Constants
const config = {
    DEBUG: (() => {
        const debug = process.env.DEBUG.toLowerCase();
        if (debug === 'true') return true;
    })(),
    PORT: process.env.PORT,
    BASE_DIR: __dirname,
    SITE_NAME: "What's for lunch?",
    SLOGAN: "Make up your mind!",
    GIPHY_API_KEY: process.env.GIPHY_API_KEY,
};


// // Database
// mongoose.connect(process.env.MONGODB_URI);
// const db = mongoose.connection;
// db.on('error', (err) => {
//     console.error(err);
//     console.log(
//         '%s MongoDB connection error. Please make sure MongoDB is running.',
//         chalk.red('✗')
//     );
//     process.exit();
// });


// Sessions
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: false,
}));


// Settings
app.set('view engine', 'pug');


// Parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Static files
app.use('/static', express.static('./static'));


// Boostrap variables to template
app.use((req, res, next) => {
    res.locals.currentUser = req.session.userId;
    res.locals.config = config;
    next();
});


// Routes
app.use(routes);

// Return a 404 error if a route wasn't matched.
app.use((err, req, res, next) => {
    const error = new Error(`Page not found.`);
    error.status = 400;
    next(error);
});

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.render('error', {
        err: err,
        DEBUG: config.DEBUG,
    });
});


// Server
app.listen(config.PORT);
console.log(`This app is running at port: ${ config.PORT }`);
