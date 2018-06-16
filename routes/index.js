const routes = require('express').Router();
const http = require('http');
const middleware = require('../middleware');
const Restaurant = require('../models/restaurant');
const User = require('../models/user');


// The top page
routes.get('/', (req, res) => {
    res.render('index');
});


// Picks a random restaurant from the database
routes.get('/pick', (req, res, next) => {
    Restaurant.count().exec((err, count) => {
        if (err) return next(err);

        const random = Math.floor(Math.random() * count);

        Restaurant.findOne({}).skip(random).exec((err, restaurant) => {
            if (err) return next(err);

            console.log(restaurant);

            // Pick a gif
            const gifs = {
                'mexican': 'https://media.giphy.com/media/QLabnqCUssHsI/giphy.gif',
                'american': 'https://media.giphy.com/media/3GCLlNvCg61ji/giphy.gif',
                'japanese': 'https://media.giphy.com/media/Xh2NX0GGpSDWU/giphy.gif',
                'french': 'https://media.giphy.com/media/2s7lb48XP0yje/giphy.gif',
                'italian': 'https://media.giphy.com/media/nASN7nIcjfPDa/giphy.gif',
                'others': 'https://media.giphy.com/media/l0MYylLtnC1ADCGys/giphy.gif',
                'indian': 'https://media.giphy.com/media/l1ugs60DfjRzHfbtS/giphy.gif',
                'thai': 'https://media.giphy.com/media/l1KsMNBQXih56B3cQ/giphy.gif',
                'tex-mex': 'https://media.giphy.com/media/OGxUX25qMNyRG/giphy.gif',
                'korean': 'https://media.giphy.com/media/xUPJPhnAzy86MR7WmI/giphy.gif',
                'hippie meal': 'https://media.giphy.com/media/d1FL4zXfIQZMWFQQ/giphy.gif',
            };

            const key = restaurant.cuisine.toLowerCase();

            let giphyUrl;
            if (key in gifs) {
                giphyUrl = gifs[key];
            } else {
                giphyUrl = gifs.others;
            }

            // Render
            res.render('partials/restaurant', { restaurant, giphyUrl });
        });
    });
});


// GET /login
routes.get('/login', (req, res) => {
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

    User.authenticate(req.body.email, req.body.password, (err, user) => {
        if (err) return next(err);
        if (user) console.log('User authenticated');
        req.session.userId = user._id;
        const nextUrl = req.query.next || '/';
        res.redirect(nextUrl);
    });
});


// GET /logout
routes.get('/logout', (req, res) => {
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
            const err = new Error('Password\'s do not match!');
            err.status = 400;
            return next(err);
        }

        // Create user object and save to database
        User.create(req.body, (err, user) => {
            if (err) return next(err);
            console.log(user);
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
        .exec(function(err, user) {
            if (err) return next(err);
            res.render('profile', { user });
        });
});


module.exports = routes;
