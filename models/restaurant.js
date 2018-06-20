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


// Get a random record
RestaurantSchema.statics.findRandom = function (callback) {
    this.model.count().exec(function (err, count) {
        // Get a random entry
        const random = Math.floor(Math.random() * count);

        // Again query all users but only fetch one offset by our random #
        this.model.findOne().skip(random).exec(function (err, result) {
            if (result === true) return callback(null, result);
            return callback(err);
        });
    });
};


// Update timestamp
RestaurantSchema.pre('save', function(next) {
   this.updated = new Date();
   next();
});


// Update `update` field on update
RestaurantSchema.pre('update', function(next) {
    this.updated = new Date();
    next();
});


module.exports = Restaurant;
