const router = require('express').Router();
const userRoute = require('./user');
const Restaurant = require('../models/restaurant');


// The top page
router.get('/', (req, res) => {
    res.render('index');
});


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


// GET /restaurant/list
// Show restaurant list
router.get('/restaurant/list', (req, res) => {
    Restaurant.find({}).sort({ updated: -1 }).exec((err, restaurant_list) => {
        if (err) return next(err);
        res.render('restaurant/list', {
            restaurant_list: restaurant_list,
        });
    });
});


router.use('/user', userRoute);


module.exports = router;
