const routes = require('express').Router();
const User = require('../models/user');


routes.get('/signup', (req, res) => {
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


routes.get('/profile', (req, res) => {
    res.render('profile');
});


module.exports = routes;