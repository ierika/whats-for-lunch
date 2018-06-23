'use strict';

const router = require('express').Router();
const Restaurant = require('../models/restaurant');
const requireLogin = require('../middleware').requireLogin;


// GET /restaurant/list
// Show restaurant list
router.get('/list', (req, res) => {
    Restaurant.find({}).sort({ updated: -1 }).exec((err, restaurant_list) => {
        if (err) return next(err);
        res.render('restaurant/list', {
            restaurant_list: restaurant_list,
        });
    });
});


// GET /restaurant/pick
// Picks a random restaurant from the database
router.get('/pick', (req, res, next) => {
    Restaurant.count().exec((err, count) => {
        if (err) return next(err);

        const random = Math.floor(Math.random() * count);

        Restaurant.findOne({}).skip(random).exec((err, restaurant) => {
            if (err) return next(err);

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

            let giphyUrl;
            if (restaurant && restaurant.cuisine) {
                const key = restaurant.cuisine.toLowerCase();

                if (key in gifs) {
                    giphyUrl = gifs[key];
                } else {
                    giphyUrl = gifs.others;
                }
            }

            // Render
            res.render('restaurant/partials/restaurant', { restaurant, giphyUrl });
        });
    });
});


// GET /restaurant/add
// Show form for creating a new restaurant entry
router.get('/add', requireLogin, (req, res) => {
    res.render('restaurant/form');
});


// POST /restaurant/add
router.post('/add', requireLogin, (req, res, next) => {
    if (req.body.name
        && req.body.cuisine
        && req.body.description) {
        // Process form
        Restaurant.create(req.body, err => {
            if (err) return next(err);
            res.status(201);
            res.redirect('/restaurant/list');
        });
    } else {
        const err = new Error('Failed to add restaurant');
        return next(err);
    }
});


// GET /restaurant/:id
// Restaurant detail page and edit page
router.get('/:id', requireLogin, (req, res, next) => {
    Restaurant.findOne({ _id: req.params.id })
        .exec((err, restaurant) => {
            if (err) {
                const err = new Error('Restaurant not found');
                err.status = 404;
                return next(err);
            }
            res.render('restaurant/form', { restaurant });
        });
});


// POST /restaurant/:id
// Update an existing restaurant record
router.post('/:id', (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
        restaurant.set(req.body);
        restaurant.save((err, restaurant) => {
            if (err) return next(err);
            res.status(200);
            res.redirect(req.originalUrl);
        });
    });
});


// POST /restaurant/:id/delete
// Deletes a restaurant
router.post('/:id/delete', requireLogin, (req, res, next) => {
    Restaurant.deleteOne({ _id: req.params.id }).exec(err => {
        if (err) return next(err);
        res.redirect('/restaurant/list');
    });
});


module.exports = router;
