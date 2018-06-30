"use strict";

const expect = require("chai").expect;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const request = require("supertest");

const User = require("../models/user");
const Fixture = {
    firstName: 'foo',
    lastName: 'bar',
    email: 'foobar@gmail.com',
    password: 'foobar'
};

dotenv.load("../.env");


describe("User Model", () => {
    let TestUser
    
    before(done => {
        // Connect to the database
        mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection;

        db.on("error", err => {
            console.error(err.message);
            process.exit(1);
        });

        done();
    });

    after(done => {
        // Close database connection
        mongoose.connection.close();
        done();
    });

    beforeEach(done => {
        // Create a dummy account
        User.findOne({ email: Fixture.email })
            .exec((err, user) => {
                if (user) {
                    TestUser = user;
                    done();
                } else {
                    User.createAccount(Object.assign({}, Fixture), (err, user) => {
                        if (err) {
                            console.error(err.message);
                            process.exit(1);
                        }

                        TestUser = user;

                        done();
                    });
                }
            });
    });

    afterEach(done => {
        if (TestUser) TestUser.remove();
        done();
    });

    it("should be able to get the user information", done => {
        expect(TestUser.email).to.eql(Fixture.email);
        done();
    });

    it('should NOT be able to create a user with the same email', done => {
        User.create(Fixture, (err, user) => {
            expect(err).to.not.be.null;
            expect(user).to.be.empty;
            done();
        });
    });

    it('should NOT be able authenticate if the credential is INCORRECT', done => {
        User.authenticate(Fixture.email, 'wrongpassword', (err, user) => {
            expect(err).to.be.an('error');
            expect(err.status).to.eql(401);
            done();
        });
    });

    it('should be able authenticate if the credential is CORRECT', done => {
        User.authenticate(Fixture.email, Fixture.password, (err, user) => {
            expect(err).to.be.null;
            expect(user.email).to.eql(TestUser.email);
            done();
        });
    });

    it('should update `updated` field when the data was altered', done => {
        const oldUpdatedDate = TestUser.updated;

        TestUser.set({ email: 'hello@gmail.com' });

        TestUser.save((err, user) => {
            expect(err).to.be.null;
            expect(user.updated).to.be.above(oldUpdatedDate);
            done();
        });
    });
});

describe('Routes', () => {
    let server;
    let TestUser;

    before(done => {
        // Start express app
        server = require('../index');
        done();
    });

    after(done => {
        // Close express app
        server.close();
        done();
    });

    beforeEach(done => {
        // Create a dummy account
        User.createAccount(Object.assign({}, Fixture), (err, user) => {
            if (err) process.exit(1);
            TestUser = user;
            done();
        });
    });

    afterEach(done => {
        if (TestUser) TestUser.remove();
        done();
    });


    // Log in
    describe('Login Routes', () => {
        it('should be to navigate to login page', done => {
            request(server)
                .get('/user/login')
                .expect(200, done);
        });

        it('should return an HTTP 400 error if no fields were filled in', done => {
            request(server)
                .post('/user/login', { email: '', password: '' })
                .expect(400, done);
        });

        it('should redirect me to the profile page upon successful login', done => {
            request(server)
                .post('/user/login')
                .send({
                    email: Fixture.email,
                    password: Fixture.password
                })
                .expect(302, done);
        });

        it('should return HTTP 401 unauthorized if password is incorrect', done => {
            request(server)
                .post('/user/login')
                .send({
                    email: Fixture.email,
                    password: 'wrongpassword'
                })
                .expect(401, done);
        });

        it('should return HTTP 401 unauthorized if email is incorrect', done => {
            request(server)
                .post('/user/login')
                .send({
                    email: 'randomuser@nonexistent.com',
                    password: Fixture.password
                })
                .expect(401, done);
        });
    });

    describe('Sign up Routes', () => {
        it('should return HTTP 200 ok', done => {
            request(server)
                .get('/user/signup')
                .expect(200, done);
        });

        it('should return HTTP 400 bad request if no fields are entered', done => {
            request(server)
                .post('/user/signup')
                .expect(400, done);
        });
    });
});

