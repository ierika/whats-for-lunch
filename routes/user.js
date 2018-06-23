const router = require('express').Router();
const User = require('../models/user');
const requireLogin = require('../middleware').requireLogin;


// GET /login
// Show login form
router.get('/login', (req, res) => {
    if (req.session.userId) {
        res.redirect('/user/profile');
    }
    res.render('user/login');
});


// POST /login
// Processes login form and authenticates user
router.post('/login', (req, res, next) => {
    if ( !(req.body.email && req.body.password) ) {
        const err = new Error('Both email and password fields are required');
        err.status = 400;
        return next(err);
    }

    User.authenticate(req.body.email, req.body.password, (err, user) => {
        if (err) return next(err);
        if (user) console.log('User authenticated');
        req.session.userId = user._id;
        const nextUrl = req.query.next || req.baseUrl + '/profile';
        res.redirect(nextUrl);
    });
});


// GET /logout
// Logs user out
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/user/login');
});


// Show signup form
router.get('/signup', (req, res) => {
    if (res.locals.currentUser) {
        res.redirect('/user/profile');
    }
    res.render('user/signup');
});


// Process signup form
router.post('/signup', (req, res, next) => {
    if (req.body.firstName
        && req.body.lastName
        && req.body.email
        && req.body.password
        && req.body.verifyPassword) {

        // Check if the email does not exist yet
        User.findOne({ email: req.body.email }).exec((err, user) => {
            if (user) {
                const err = new Error('Email already registered');
                err.status = 400;
                return next(err);
            }
        });

        // Check if the passwords match
        if (req.body.password !== req.body.verifyPassword) {
            const err = new Error('Password\'s do not match!');
            err.status = 400;
            return next(err);
        }

        // Create user object and save to database
        User.create(req.body, (err, user) => {
            if (err) return next(err);
            console.log(user);
            console.log('User created');
            res.redirect('/user/profile');
        })
    } else {
        const err = new Error('All fields are required');
        err.status = 400;
        err.goBackUrl = '/signup';
        return next(err);
    }
});


// Show profile
router.get('/profile', requireLogin, (req, res, next) => {
    const userId = req.session.userId;
    User.findById(userId)
        .exec(function(err, user) {
            if (err) return next(err);
            res.render('user/profile', { user });
        });
});


// Update profile
router.post('/profile', requireLogin, (req, res, next) => {
    User.update({ _id: req.session.userId }, { $set: req.body }, (err, user) => {
        if (err) return next(err);
        res.redirect(req.originalUrl);
    });
});


// Change password form
router.get('/change-password', requireLogin, (req, res, next) => {
    res.render('user/change-password');
});


// Change password processor
router.post('/change-password', requireLogin, (req, res, next) => {
    if (req.body.password && req.body.verifyPassword) {
        // If passwords do not match
        if (req.body.password !== req.body.verifyPassword) {
            const err = new Error('Passwords do not match!');
            err.status = 400;
            return next(err);
        }

        // Update database
        User.findById(req.session.userId, (err, user) => {
            if (err) return next(err);
            user.password = req.body.password;
            user.save((err, user) => {
                if (err) return next(err);
                res.redirect(req.baseUrl + '/profile');
            });
        });
    } else {
        if (err) {
            const err = new Error('All fields are required!');
            err.status = 400;
            return next(err);
        }
    }
});


module.exports = router;
