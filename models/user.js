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
 * Statics
 */
UserSchema.statics.authenticate = function(email, password, callback) {
    this.findOne({ email: email })
        .exec(function(error, user) {
            // Return any errors from the query
            if (error) return callback(error);

            // Return error if no user was found.
            if ( !user ) {
                const err = new Error('User not found.');
                err.status = 401;
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


// Check if password is a match
UserSchema.methods.isPasswordMatch = function(password, callback) {
    bcrypt.compare(password, this.password, function(error, result) {
        if (error) {
            const err = new Error('Could not compare password');
            err.status = 500;
            return callback(err);
        }

        return callback(null, result);
    });
};


// Checks if the user is authenticated
UserSchema.statics.isAuthenticated = function(req) {
    return req.session.userId || false;
};


// Hash password
UserSchema.statics.hashPassword = function hashPassword(password, callback) {
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return callback(err);
        return callback(null, hash);
    });
}

// Create account
UserSchema.statics.createAccount = function(postData, callback) {
    if (postData && postData.password) {
        // Hash password first
        this.hashPassword(postData.password, (err, hash) => {
            if (err) {
                const err = new Error('Could not encrypt password');
                err.status(500);
                return callback(err);
            }

            postData.password = hash;

            // Then create account
            this.create(postData, (err, user) => {
                if (err) return callback(err);
                return callback(null, user);
            });
        });
    }
};


// Change password
UserSchema.methods.changePassword = function(newPassword, callback) {
    this.constructor.hashPassword(newPassword, (err, hash) => {
        if (err) return callback(err);

        this.password = hash;

        this.save((err, user) => {
            if (err) return callback(err);
            return callback(err, user);
        });
    });
};


// Hash password
UserSchema.pre('save', function(next) {
    this.updated = new Date();
    next();
});


// Update `update` field on update
UserSchema.pre('update', function(next) {
    this.updated = new Date();
    next();
});


const User = mongoose.model('User', UserSchema);
module.exports = User;
