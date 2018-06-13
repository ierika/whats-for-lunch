const routes = require('express').Router();
const http = require('http');
const request = require('request');
const middleware = require('../middleware');
const Restaurant = require('../models/restaurant');


routes.use('', require('./user'));


routes.get('/', (req, res, next) => {
    res.render('index');
});


routes.get('/pick', (req, res, next) => {
    // Restaurant.find({}, (error, restaurant) => {
    //     console.log(restaurant);
    //     res.end(error);
    // });

    http.get(`http://${req.get('Host')}/static/restaurants.json`, resp => {
        let data = '';
        resp.on('data', chunk => data += chunk);
        resp.on('end', () => {
            const restaurants = JSON.parse(data);
            console.log(restaurants);
            const randInt = Math.floor((Math.random()*restaurants.length));
            const restaurant = restaurants[randInt];
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
            }

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


module.exports = routes;
