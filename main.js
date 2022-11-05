/*jshint node: true */
/*jshint esversion: 6 */
'use strict';

const misc = require('./misc');
const api = require('./api');
const auth = require('./auth');

// express.js init
const express = require('express');
const session = require('express-session');
const app = express();
var port = process.env.PORT || 3000;

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

const api_header = "/api/v1";
app.use(api_header, api);
app.use(api_header, auth);

// miscellaneous
app.listen(port, () => {
    console.log(`Klausimėlis listening on port ${port}`);
});

app.use((req, res, next) => {
    res.status(404).json(misc.not_found_error);
});

app.use(function (err, req, res, next) {
    if (err.type == "entity.parse.failed") {
        res.status(400).json({ code: 400, err: "BAD_REQUEST", message: "JSON parsing failed" });
        return;
    }

    misc.error500(err, req, res, next);
    return;
});
