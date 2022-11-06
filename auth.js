/*jshint node: true */
/*jshint esversion: 6 */
'use strict';

const misc = require('./misc');
const connection = require('./db');

const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const AnonymousStrategy = require('passport-anonymous').Strategy;
const issuer = "Klausimėlis";

const email_validator = require("email-validator");

const jwt = require('jsonwebtoken');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new AnonymousStrategy()); // for optional auth

passport.use(new LocalStrategy({ usernameField: 'email' }, function verify(email, password, cb) {
    if (!email_validator.validate(email)) {
        return cb(null, false, { message: 'Incorrect email or password.' });
    }

    connection.query('SELECT * FROM `users` WHERE `email` = ?;',
        [email],
        (err, rows, fields) => {
            if (err) {
                return cb(err);
            }

            if (rows.length < 1) {
                return cb(null, false, { message: 'Incorrect email or password.' });
            }

            var user = rows[0];

            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
                if (err) {
                    return cb(err);
                }

                if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                    return cb(null, false, { message: 'Incorrect email or password.' });
                }

                delete user.password;
                delete user.salt;

                return cb(null, user);
            });
        });
}));

passport.use(new JwtStrategy({
    secretOrKey: process.env.JWT_SECRET,
    issuer: issuer,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
},
    (jwt_payload, done) => {
        var ret = {};

        ret.username = jwt_payload.username;
        ret.id = jwt_payload.id;
        ret.email = jwt_payload.email;
        ret.role = jwt_payload.role;

        return done(null, ret);
    }
));

router.get('/user', passport.authenticate('jwt'), (req, res) => {
    res.status(200).json(req.user);
});

router.get('/user/:userId', passport.authenticate(['jwt', 'anonymous']), (req, res) => {
    if (req.user && req.user.id == req.params.userId) {
        res.status(200).json(req.user);
    }
    else {
        connection.query('SELECT `id`, `username` FROM `users` WHERE `id` = ?;',
            [req.params.userId],
            (err, rows, fields) => {
                if (err) {
                    misc.error500(err, req, res, null);
                    return;
                }

                if (rows.length < 1) {
                    res.status(404).json(misc.not_found_error);
                    return;
                }

                if (rows[0].id != req.params.userId) {
                    res.status(404).json(misc.not_found_error);
                    return;
                }

                res.status(200).json(rows[0]);
            });
    }
});

router.post('/login',
    passport.authenticate(['jwt', 'local']),
    (req, res) => {
        var ret = req.user;

        ret.token = jwt.sign(req.user, process.env.JWT_SECRET, {
            expiresIn: "2h",
            issuer: issuer
        });

        req.logout(function (err) { });

        res.status(200).json(ret);
    });

router.post('/register', (req, res) => {
    var clean = misc.cleanUpInput(req.body, ["username", "password", "email"]);

    if (!misc.allRequiredKeysExist(clean, ["username", "password", "email"])) {
        res.status(400).json({ code: 400, err: "BAD_REQUEST", message: "Not enough paramaters supplied" });
        return;
    }

    if (!email_validator.validate(clean.email)) {
        res.status(400).json({ code: 400, err: "BAD_REQUEST", message: "Invalid email" });
        return;
    }

    connection.query('SELECT 1 FROM `users` WHERE `email` = ?;',
        [clean.email],
        (err, rows, fields) => {
            if (err) {
                misc.error500(err, req, res, null);
                return;
            }

            if (rows.length > 0) {
                var ret = misc.forbidden_error;
                ret.message = "Email already exists in the system";

                res.status(403).json(ret);
                return;
            }

            var salt = crypto.randomBytes(16);

            crypto.pbkdf2(clean.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
                clean.password = hashedPassword;
                clean.salt = salt;

                connection.query('INSERT INTO `users` SET ?;',
                    [clean],
                    (err, rows, fields) => {
                        if (err) {
                            if (err.code == 'ER_NO_REFERENCED_ROW_2') { // technically should never trigger
                                res.status(404).json(misc.not_found_error);
                                return;
                            }

                            misc.error500(err, req, res, null);
                            return;
                        }

                        connection.query('SELECT `id`, `email`, `username` FROM `users` WHERE `id`= LAST_INSERT_ID();',
                            [clean],
                            (err, rows, fields) => {
                                if (err) {
                                    misc.error500(err, req, res, null);
                                    return;
                                }

                                if (rows.length < 1) {
                                    misc.error500(err, req, res, null);
                                    return;
                                }

                                res.status(201).json(rows[0]);
                            });
                    });
            });
        });
});

module.exports = router;
