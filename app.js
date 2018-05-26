'use strict';

// Requirements
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');
// const mongoose = require('mongoose');
const chalk = require('chalk');
const dotenv = require('dotenv');

// Load dotenv
dotenv.load('./env');

// Constants
const PORT = process.env.PORT || 3000;
const DEBUG = process.env.DEBUG || false;
const BASE_DIR = __dirname;

// Database
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

// Settings
app.set('view engine', 'pug');

// Parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static files
app.use('/static', express.static('./static'));

// Boostrap variables
app.use((req, res, next) => {
    res.locals.config = require('./config');
    next();
});

// Routes
app.use(routes);

// Error handler
app.use((err, req, res, next) => {
    res.locals.err = err;
    console.log(err);
    res.status(500);
    res.render('error', { DEBUG: DEBUG } );
});

// Server
app.listen(PORT);
console.log(`This app is running at port: ${ PORT }`);
