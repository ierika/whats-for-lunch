const routes = require('express').Router();
const http = require('http');

routes.get('', (req, res) => {
    res.render('index');
});

routes.get('/pick', (req, res) => {
    http.get(`http://${req.get('Host')}/static/restaurants.json`, resp => {
        let data = '';
        resp.on('data', chunk => data += chunk);
        resp.on('end', () => {
            const { restaurants } = JSON.parse(data);
            const randInt = Math.floor((Math.random()*restaurants.length));
            const restaurant = restaurants[randInt];
            console.log(restaurant);
            res.render('partials/restaurant', { restaurant });
        });
    });
});

module.exports = routes;
