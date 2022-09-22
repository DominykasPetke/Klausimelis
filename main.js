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

// topics
app.get(api_header + '/topics', (req, res) => {
    var ret = not_implemented_error;
    ret.text = "GET REQUEST";
    res.status(501).json(ret);
});

app.get(api_header + '/topics/:topicId', (req, res) => {
    var ret = not_implemented_error;
    ret.topicId = req.params.topicId;
    res.status(501).json(ret);
});

app.post(api_header + '/topics', (req, res) => {
    var ret = not_implemented_error;
    ret.text = "POST REQUEST";
    res.status(501).json(ret);
});

app.put(api_header + '/topics/:topicId', (req, res) => {
    var ret = not_implemented_error;
    ret.topicId = req.params.topicId;
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
    ret.topicId = req.params.topicId;
    ret.text = "DELETE";
    res.status(501).json(ret);
});

// themes
app.get(api_header + '/topics/:topicId/themes', (req, res) => {
    var ret = not_implemented_error;
    ret.topicId = req.params.topicId;
    ret.text = "GET REQUEST";
    res.status(501).json(ret);
});

app.get(api_header + '/topics/:topicId/themes/:themeId', (req, res) => {
    var ret = not_implemented_error;
    ret.topicId = req.params.topicId;
    ret.themeId = req.params.themeId;
    res.status(501).json(ret);
});

app.post(api_header + '/topics/:topicId/themes', (req, res) => {
    var ret = not_implemented_error;
    ret.topicId = req.params.topicId;
    ret.text = "POST REQUEST";
    res.status(501).json(ret);
});

app.put(api_header + '/topics/:topicId/themes/:themeId', (req, res) => {
    var ret = not_implemented_error;
    ret.topicId = req.params.topicId;
    ret.themeId = req.params.themeId;
    ret.text = "PUT";
    res.status(501).json(ret);
});

app.patch(api_header + '/topics/:topicId/themes', (req, res) => {
    var ret = not_implemented_error;
    ret.topicId = req.params.topicId;
    ret.text = "PATCH";
    res.status(501).json(ret);
});

app.delete(api_header + '/topics/:topicId/themes/:themeId', (req, res) => {
    var ret = not_implemented_error;
    ret.topicId = req.params.topicId;
    ret.themeId = req.params.themeId;
    ret.text = "DELETE";
    res.status(501).json(ret);
});

// questions
app.get(api_header + '/topics/:topicId/themes/:themeId/questions', (req, res) => {
    // potentially with no answers here?
    var ret = not_implemented_error;
    ret.topicId = req.params.topicId;
    ret.themeId = req.params.themeId;
    ret.text = "GET REQUEST";
    res.status(501).json(ret);
});

app.get(api_header + '/topics/:topicId/themes/:themeId/questions/:questionId', (req, res) => {
    // potentially include answers here?
    var ret = not_implemented_error;
    ret.topicId = req.params.topicId;
    ret.themeId = req.params.themeId;
    ret.questionId = req.params.questionId;
    res.status(501).json(ret);
});

app.post(api_header + '/topics/:topicId/themes/:themeId/questions', (req, res) => {
    var ret = not_implemented_error;
    ret.topicId = req.params.topicId;
    ret.themeId = req.params.themeId;
    ret.text = "POST REQUEST";
    res.status(501).json(ret);
});

app.put(api_header + '/topics/:topicId/themes/:themeId/questions/:questionId', (req, res) => {
    var ret = not_implemented_error;
    ret.topicId = req.params.topicId;
    ret.themeId = req.params.themeId;
    ret.questionId = req.params.questionId;
    ret.text = "PUT";
    res.status(501).json(ret);
});

app.delete(api_header + '/topics/:topicId/themes/:themeId/questions/:questionId', (req, res) => {
    var ret = not_implemented_error;
    ret.topicId = req.params.topicId;
    ret.themeId = req.params.themeId;
    ret.questionId = req.params.questionId;
    ret.text = "DELETE";
    res.status(501).json(ret);
});

// miscellaneous
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