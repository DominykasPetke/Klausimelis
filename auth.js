/*jshint node: true */
/*jshint esversion: 6 */
'use strict';

const misc = require('./misc');
const connection = require('./db');

const express = require('express');
const router = express.Router();

const crypto = require('crypto');

// OAuth
router.get('/token', (req, res) => {
    var ret = misc.not_implemented_error;
    ret.text = "Token";
    res.status(501).json(ret);
});

router.post('/login', (req, res) => {
    var ret = misc.not_implemented_error;
    ret.text = "Login";
    res.status(501).json(ret);
});

router.post('/register', (req, res) => {
    var clean = misc.cleanUpInput(req.body, ["username", "password", "email"]);

    if (!misc.allRequiredKeysExist(clean, ["username", "password", "email"])) {
        res.status(400).json({ code: 400, err: "BAD_REQUEST", message: "Not enough paramaters supplied" });
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
