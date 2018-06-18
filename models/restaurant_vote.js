const mongoose = require('mongoose');
const timestamp = require('./timestamp');


const RestaurantVoteSchema = mongoose.Schema({

});


const RestaurantVote = mongoose.model('RestaurantVote', RestaurantVoteSchema);
module.exports = RestaurantVote;