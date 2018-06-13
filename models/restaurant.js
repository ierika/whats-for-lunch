const mongoose = require('mongoose');
const timestamp = require('./timestamp');

const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        max: 100,
        min: 3,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        max: 100,
        trim: true,
    },
    cuisine: {
        type: String,
        max: 100,
        trim: true,
    },
    website: {
        type: String,
        max: 100,
        trim: true,
    },
    priceLow: Number,
    priceHigh: Number,
    ...timestamp,
});


const Restaurant = mongoose.model('Restaurant', RestaurantSchema);


module.exports = Restaurant;
