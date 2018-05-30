const routes = require('express').Router();
const User = require('../models/user');
const middleware = require('../middleware');


// GET /login
routes.get('/login', (req, res, next) => {
    console.log('login');
    if (req.session.userId) {
        res.redirect('/profile');
    }
    res.render('login');
});


// POST /login
routes.post('/login', (req, res, next) => {
    if ( !(req.body.email && req.body.password) ) {
        const err = new Error('Both email and password fields are required');
        err.status = 400;
        return next(err);
    }

    User.authenticate(req.body.email, req.body.password, (error, user) => {
        if (error) return next(error);
        if (user) console.log('User authenticated');
        req.session.userId = user._id;
        const nextUrl = req.query.next || '/';
        res.redirect(nextUrl);
    });
});


// GET /logout
routes.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/login');
});


routes.get('/signup', (req, res, next) => {
    if (res.locals.currentUser) {
        const err = new Error("You're already registered.");
        err.status = 400;
        return next(err);
    }
    res.render('signup');
});


routes.post('/signup', (req, res, next) => {
    if (req.body.firstName
        && req.body.lastName
        && req.body.email
        && req.body.password
        && req.body.verifyPassword) {

        // Check if the passwords match
        if (req.body.password !== req.body.verifyPassword) {
            let err = new Error('Password\'s do not match!');
            err.status = 400;
            return next(err);
        }

        // Create user object and save to database
        User.create(req.body, (err, user) => {
            if (err) return next(err);
            console.log('User created');
            res.redirect('./profile');
        })
    } else {
        const err = new Error('All fields are required');
        err.status = 400;
        err.goBackUrl = '/signup';
        return next(err);
    }
});


routes.get('/profile', middleware.requireLogin, (req, res, next) => {
    const userId = req.session.userId;
    User.findById(userId)
        .exec(function(error, user) {
            if (error) return next(error);
            res.render('profile', { user });
        });
});


module.exports = routes;
