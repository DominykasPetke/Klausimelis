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


app.get('/:text', (req, res) => {
    res.send('Hello ' + req.params.text + '!');
});

app.get('/', (req, res) => {
    if (req.query.name != null) {
        res.send('Hi ' + req.query.name + '!');
    }
    else {
        res.status(202).send('No params');
    }
});

app.listen(port, () => {
    console.log(`Klausimėlis listening on port ${port}`);
});

app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});