'use strict';

// Requirements
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');
// const mongoose = require('mongoose');
const chalk = require('chalk');
const dotenv = require('dotenv');
const session = require('express-session');

// Load dotenv
dotenv.load('./env');

// Constants
const config = {};
config.PORT = process.env.PORT || 3000;
config.DEBUG = process.env.DEBUG || false;
config.BASE_DIR = __dirname;
config.SITE_NAME = "What's for lunch?";
config.SLOGAN = "Make up your mind!";
config.GIPHY_API_KEY = process.env.GIPHY_API_KEY;


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

// Boostrap variables
app.use((req, res, next) => {
    res.locals.config = config;
    next();
});

// Routes
app.use(routes);

// Error handler
app.use((err, req, res, next) => {
    console.log(err);
    res.locals.err = err;
    res.status(500);
    res.render('error', { DEBUG: config.DEBUG } );
});

// Server
app.listen(config.PORT);
console.log(`This app is running at port: ${ config.PORT }`);
