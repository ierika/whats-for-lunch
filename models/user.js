const mongoose = require('mongoose');
const timestamp = require('./timestamp');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
    ...timestamp,
    email: {
        type: String,
        max: 100,
        min: 3,
        required: true,
        unique: true,
        trim: true,
    },
    firstName: {
        type: String,
        max: 50,
        min: 3,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        max: 50,
        min: 3,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
});


// Hash password
// In order for `this` to work properly,
// We must not use arrow functions.
UserSchema.pre('save', function(next) {
    const user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});


const User = mongoose.model('User', UserSchema);
module.exports = User;
