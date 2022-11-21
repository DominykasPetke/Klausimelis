/*jshint node: true */
/*jshint esversion: 6 */
'use strict';

// db init
const mysql = require('mysql2');
var connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect();

connection.query('SELECT 21 + 21 AS solution', (err, rows, fields) => {
    if (err) throw err;

    console.log('The answer to life is:', rows[0].solution);
});

connection.on('error', function (err) {
    console.log(err); // 'ER_BAD_DB_ERROR'
});


var hours = 6;
var the_interval = hours * 60 * 60 * 1000;

setInterval(function () {
    connection.ping(function (err) {
        if (err) throw err;

        console.log('Server responded to ping');
    });
}, the_interval);

module.exports = connection;
