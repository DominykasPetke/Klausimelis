/*jshint node: true */
/*jshint esversion: 6 */
'use strict';

// express.js init
const express = require('express');
const app = express();
const port = 3000;

// db init
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'dominykas',
    password: 'password',
    database: 'test'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
    if (err) throw err;

    console.log('The solution is: ', rows[0].solution);
});

connection.end();

const api_header = "/api/v1";
const not_implemented_error = { code: 501, err: "NOT_IMPLEMENTED", message: "Not implemented (yet)" };

app.get(api_header + '/topics', (req, res) => {
    var ret = not_implemented_error;
    ret.text = "GET REQUEST";
    res.status(501).json(ret);
});

app.get(api_header + '/topics/:topicId', (req, res) => {
    var ret = not_implemented_error;
    ret.id = req.params.topicId;
    res.status(501).json(ret);
});

app.post(api_header + '/topics', (req, res) => {
    var ret = not_implemented_error;
    ret.text = "POST REQUEST";
    res.status(501).json(ret);
});

app.put(api_header + '/topics/:topicId', (req, res) => {
    var ret = not_implemented_error;
    ret.id = req.params.topicId;
    ret.text = "PUT";
    res.status(501).json(ret);
});

app.patch(api_header + '/topics', (req, res) => {
    var ret = not_implemented_error;
    ret.text = "PATCH";
    res.status(501).json(ret);
});

app.delete(api_header + '/topics/:topicId', (req, res) => {
    var ret = not_implemented_error;
    ret.id = req.params.topicId;
    ret.text = "DELETE";
    res.status(501).json(ret);
});

app.listen(port, () => {
    console.log(`Klausimėlis listening on port ${port}`);
});

app.use((req, res, next) => {
    res.status(404).json({ code: 404, err: "NOT_FOUND", message: "Page not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ code: 500, err: "SERVER_ERROR", message: "Internal Server Error" });
});