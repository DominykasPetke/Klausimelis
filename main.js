/*jshint node: true */
/*jshint esversion: 6 */
'use strict';

const misc = require('./misc');
const api = require('./api');

// express.js init
const express = require('express');
const app = express();
var port = process.env.PORT;

app.use(express.json());

const api_header = "/api/v1";
app.use(api_header, api);

// OAuth
app.get(api_header + '/authorise', (req, res) => {
    var ret = misc.not_implemented_error;
    ret.text = "Auth";
    res.status(501).json(ret);
});

app.get(api_header + '/token', (req, res) => {
    var ret = misc.not_implemented_error;
    ret.text = "Token";
    res.status(501).json(ret);
});

app.get(api_header + '/login', (req, res) => {
    var ret = misc.not_implemented_error;
    ret.text = "Login";
    res.status(501).json(ret);
});

app.get(api_header + '/register', (req, res) => {
    var ret = misc.not_implemented_error;
    ret.text = "Register";
    res.status(501).json(ret);
});

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
