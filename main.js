/*jshint node: true */
/*jshint esversion: 6 */
'use strict';

// express.js init
const express = require('express');
const app = express();
const port = 3001;

// db init
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'dominykas',
    password: 'password',
    database: 'klausimelis'
});

connection.connect();

connection.query('SELECT 21 + 21 AS solution', (err, rows, fields) => {
    if (err) throw err;

    console.log('The answer to life is:', rows[0].solution);
});

connection.on('error', function (err) {
    console.log(err); // 'ER_BAD_DB_ERROR'
});

// connection.end();

const api_header = "/api/v1";
const not_implemented_error = { code: 501, err: "NOT_IMPLEMENTED", message: "Not implemented (yet)" };
const not_found_error = { code: 404, err: "NOT_FOUND", message: "Page not found" };

// topics
app.get(api_header + '/topics', (req, res) => {
    connection.query('SELECT * FROM `klausimelis`.`topics`;', (err, rows, fields) => {
        if (err) throw err;

        res.status(200).json(rows);
    });
});

app.get(api_header + '/topics/:topicId', (req, res) => {
    connection.query('SELECT * FROM `klausimelis`.`topics` WHERE `id` = ?;',
        [req.params.topicId],
        (err, rows, fields) => {
            if (err) throw err;

            if (rows.length < 1) {
                res.status(404).json(not_found_error);
                return;
            }

            res.status(200).json(rows[0]);
        });
});

app.post(api_header + '/topics', (req, res) => {
    var ret = not_implemented_error;
    ret.text = "POST REQUEST";
    res.status(501).json(ret);
});

app.patch(api_header + '/topics/:topicId', (req, res) => {
    var ret = not_implemented_error;
    ret.topicId = req.params.topicId;
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
    connection.query('SELECT 1 FROM `klausimelis`.`topics` WHERE `id` = ?;',
        [req.params.topicId],
        (err, rows, fields) => {
            if (rows.length < 1) {
                res.status(404).json(not_found_error);
                return;
            }

            connection.query('SELECT `themes`.`id`, `themes`.`name`, `themes`.`description` FROM `klausimelis`.`themes` WHERE `FK_topicId` = ?;',
                [req.params.topicId],
                (err, rows, fields) => {
                    if (err) throw err;

                    if (rows.length < 1) {
                        res.status(404).json(not_found_error);
                        return;
                    }

                    res.status(200).json(rows);
                });
        });
});

app.get(api_header + '/topics/:topicId/themes/:themeId', (req, res) => {
    connection.query('SELECT `themes`.`id`, `themes`.`name`, `themes`.`description` FROM `klausimelis`.`themes` WHERE `FK_topicId` = ? AND `id` = ?;',
        [req.params.topicId, req.params.themeId],
        (err, rows, fields) => {
            if (err) throw err;

            if (rows.length < 1) {
                res.status(404).json(not_found_error);
                return;
            }

            res.status(200).json(rows[0]);
        });
});

app.post(api_header + '/topics/:topicId/themes', (req, res) => {
    var ret = not_implemented_error;
    ret.topicId = req.params.topicId;
    ret.text = "POST REQUEST";
    res.status(501).json(ret);
});

app.patch(api_header + '/topics/:topicId/themes/:themeId', (req, res) => {
    var ret = not_implemented_error;
    ret.topicId = req.params.topicId;
    ret.themeId = req.params.themeId;
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
    res.status(404).json(not_found_error);
});

app.use(catcher);

function catcher(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ code: 500, err: "SERVER_ERROR", message: "Internal Server Error" });
}
