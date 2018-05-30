const mongoose = require('mongoose');
const timestamp = require('./timestamp');
const bcrypt = require('bcrypt');


/*
 * Schema
 */

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


/*
 * Methods
 */
UserSchema.statics.authenticate = function(email, password, callback) {
    console.log('Authenticating user...');
    User.findOne({ email: email })
        .exec(function(error, user) {
            // Return any errors from the query
            if (error) return callback(error);

            // Return error if no user was found.
            if ( !user ) {
                var err = new Error('User not found.');
                err.status = 401
                return callback(err);
            }

            // Finally, compare password against each other
            bcrypt.compare(password, user.password, function(error, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    const err = new Error('Wrong password.');
                    err.status = 401;
                    return callback(err);
                }
            });
        });
};


/*
 * Hooks
 */

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


// Update `update` field on update
UserSchema.pre('update', function(next) {
    const user = this;
    user.update = Date.now();
});


const User = mongoose.model('User', UserSchema);
module.exports = User;
