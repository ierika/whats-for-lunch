const router = require('express').Router();
const User = require('../models/user');
const middleware = require('../middleware');


// GET /login
router.get('/login', (req, res) => {
    if (req.session.userId) {
        res.redirect('/user/profile');
    }
    res.render('user/login');
});


// POST /login
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
        const nextUrl = req.query.next || '/';
        res.redirect(nextUrl);
    });
});


// GET /logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/user/login');
});


router.get('/signup', (req, res) => {
    if (res.locals.currentUser) {
        res.redirect('/user/profile');
    }
    res.render('user/signup');
});


router.post('/signup', (req, res, next) => {
    if (req.body.firstName
        && req.body.lastName
        && req.body.email
        && req.body.password
        && req.body.verifyPassword) {

        // Check if the email does not exist yet
        User.find({ email: req.body.email }).exec((err, user) => {
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


router.get('/profile', middleware.requireLogin, (req, res, next) => {
    const userId = req.session.userId;
    User.findById(userId)
        .exec(function(err, user) {
            if (err) return next(err);
            res.render('user/profile', { user });
        });
});


module.exports = router;
