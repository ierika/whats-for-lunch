const mongoose = require('mongoose');
const timestamp = require('./timestamp');

const RestaurantSchema = new mongoose.Schema({
    ...timestamp,
    name: {
        type: String,
        max: 100,
        min: 3,
        required: true,
        trim: true,
    },
    website: {
        type: String,
        max: 100,
        trim: true,
    }
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
module.exports = Restaurant;
