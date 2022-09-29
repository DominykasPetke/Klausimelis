/*jshint node: true */
/*jshint esversion: 6 */
'use strict';

// express.js init
const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

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

const api_header = "/api/v1";
const not_implemented_error = { code: 501, err: "NOT_IMPLEMENTED", message: "Not implemented (yet)" };
const not_found_error = { code: 404, err: "NOT_FOUND", message: "Page not found" };

// topics
app.get(api_header + '/topics', (req, res) => {
    connection.query('SELECT * FROM `topics`;', (err, rows, fields) => {
        if (err) {
            error500(err, req, res, null);
            return;
        }

        res.status(200).json(rows);
    });
});

app.get(api_header + '/topics/:topicId', (req, res) => {
    connection.query('SELECT * FROM `topics` WHERE `id` = ?;',
        [req.params.topicId],
        (err, rows, fields) => {
            if (err) {
                error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(not_found_error);
                return;
            }

            res.status(200).json(rows[0]);
        });
});

app.post(api_header + '/topics', (req, res) => {
    var clean = cleanUpInput(req.body, ["name", "description"]);

    if (!allRequiredKeysExist(clean, ["name"])) {
        res.status(400).json({ code: 400, err: "BAD_REQUEST", message: "Not enough paramaters supplied" });
        return;
    }

    connection.query('INSERT INTO `topics` SET ? RETURNING *;',
        [clean],
        (err, rows, fields) => {
            if (err) {
                error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                error500(err, req, res, null);
                return;
            }

            res.location(api_header + "/topics/" + rows[0].id).status(201).json(rows[0]);
        });
});

app.patch(api_header + '/topics/:topicId', (req, res) => {
    connection.query('SELECT 1 FROM `topics` WHERE `id` = ?;',
        [req.params.topicId],
        (err, rows, fields) => {
            if (err) {
                error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(not_found_error);
                return;
            }

            var clean = cleanUpInput(req.body, ["name", "description"]);

            if (Object.keys(clean).length < 1) {
                res.status(400).json({ code: 400, err: "BAD_REQUEST", message: "Not enough paramaters supplied" });
                return;
            }

            connection.query('UPDATE `topics` SET ? WHERE `id` = ?;',
                [clean, req.params.topicId],
                (err, rows, fields) => {
                    if (err) {
                        error500(err, req, res, null);
                        return;
                    }

                    if (rows.length < 1) {
                        error500(err, req, res, null);
                        return;
                    }

                    res.sendStatus(204);
                });
        });
});

app.delete(api_header + '/topics/:topicId', (req, res) => {
    connection.query('DELETE FROM `topics` WHERE `id` = ? RETURNING *;',
        [req.params.topicId],
        (err, rows, fields) => {
            if (err) {
                error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(not_found_error);
                return;
            }

            res.status(200).send();
        });
});

// themes
app.get(api_header + '/topics/:topicId/themes', (req, res) => {
    connection.query('SELECT 1 FROM `topics` WHERE `id` = ?;',
        [req.params.topicId],
        (err, rows, fields) => {
            if (err) {
                error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(not_found_error);
                return;
            }

            connection.query('SELECT `themes`.`id`, `themes`.`name`, `themes`.`description` FROM `themes` WHERE `FK_topicId` = ?;',
                [req.params.topicId],
                (err, rows, fields) => {
                    if (err) {
                        error500(err, req, res, null);
                        return;
                    }

                    res.status(200).json(rows);
                });
        });
});

app.get(api_header + '/topics/:topicId/themes/:themeId', (req, res) => {
    connection.query('SELECT `themes`.`id`, `themes`.`name`, `themes`.`description` FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;',
        [req.params.topicId, req.params.themeId],
        (err, rows, fields) => {
            if (err) {
                error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(not_found_error);
                return;
            }

            res.status(200).json(rows[0]);
        });
});

app.post(api_header + '/topics/:topicId/themes', (req, res) => {
    var clean = cleanUpInput(req.body, ["name", "description"]);

    if (!allRequiredKeysExist(clean, ["name"])) {
        res.status(400).json({ code: 400, err: "BAD_REQUEST", message: "Not enough paramaters supplied" });
        return;
    }

    clean.FK_topicId = req.params.topicId;

    connection.query('INSERT INTO `themes` SET ? RETURNING `themes`.`id`, `themes`.`name`, `themes`.`description`;',
        [clean],
        (err, rows, fields) => {
            if (err) {
                if (err.code == 'ER_NO_REFERENCED_ROW_2') {
                    res.status(404).json(not_found_error);
                    return;
                }

                error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                error500(err, req, res, null);
                return;
            }

            res.location(api_header + "/topics/" + req.params.topicId + "/themes/" + rows[0].id).status(201).json(rows[0]);
        });
});

app.patch(api_header + '/topics/:topicId/themes/:themeId', (req, res) => {
    connection.query('SELECT 1 FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;',
        [req.params.topicId, req.params.themeId],
        (err, rows, fields) => {
            if (err) {
                error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(not_found_error);
                return;
            }

            var clean = cleanUpInput(req.body, ["name", "description"]);

            if (Object.keys(clean).length < 1) {
                res.status(400).json({ code: 400, err: "BAD_REQUEST", message: "Not enough paramaters supplied" });
                return;
            }

            connection.query('UPDATE `themes` SET ? WHERE `FK_topicId` = ? AND `id` = ?;',
                [clean, req.params.topicId, req.params.themeId],
                (err, rows, fields) => {
                    if (err) {
                        error500(err, req, res, null);
                        return;
                    }

                    if (rows.length < 1) {
                        error500(err, req, res, null);
                        return;
                    }

                    res.sendStatus(204);
                });
        });
});

app.delete(api_header + '/topics/:topicId/themes/:themeId', (req, res) => {
    connection.query('DELETE FROM `themes` WHERE `FK_topicId` = ? AND `id` = ? RETURNING *;',
        [req.params.topicId, req.params.themeId],
        (err, rows, fields) => {
            if (err) {
                error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(not_found_error);
                return;
            }

            res.status(200).send();
        });
});

// questions
app.get(api_header + '/topics/:topicId/themes/:themeId/questions', (req, res) => {
    connection.query('SELECT 1 FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;',
        [req.params.topicId, req.params.themeId],
        (err, rows, fields) => {
            if (err) {
                error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(not_found_error);
                return;
            }

            connection.query('SELECT `questions`.`id`, `questions`.`question`, `questions`.`answers` FROM `questions` WHERE `FK_themeId` = ?;',
                [req.params.themeId],
                (err, rows, fields) => {
                    if (err) {
                        error500(err, req, res, null);
                        return;
                    }

                    // potentially with no answers here?
                    rows.forEach(element => {
                        element.answers = JSON.parse(element.answers);
                        // delete element.answers;
                    });

                    res.status(200).json(rows);
                });
        });
});

app.get(api_header + '/topics/:topicId/themes/:themeId/questions/:questionId', (req, res) => {
    // potentially include answers here?
    connection.query('SELECT 1 FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;',
        [req.params.topicId, req.params.themeId],
        (err, rows, fields) => {
            if (err) {
                error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(not_found_error);
                return;
            }

            connection.query('SELECT `questions`.`id`, `questions`.`question`, `questions`.`answers` FROM `questions` WHERE `FK_themeId` = ? AND `id` = ?',
                [req.params.themeId, req.params.questionId],
                (err, rows, fields) => {
                    if (err) {
                        error500(err, req, res, null);
                        return;
                    }

                    if (rows.length < 1) {
                        res.status(404).json(not_found_error);
                        return;
                    }

                    // potentially with no answers here?
                    rows.forEach(element => {
                        element.answers = JSON.parse(element.answers);
                        // delete element.answers;
                    });

                    res.status(200).json(rows[0]);
                });
        });
});

app.post(api_header + '/topics/:topicId/themes/:themeId/questions', (req, res) => {
    connection.query('SELECT 1 FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;',
        [req.params.topicId, req.params.themeId],
        (err, rows, fields) => {
            if (err) {
                error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(not_found_error);
                return;
            }

            var clean = cleanUpInput(req.body, ["question", "answers"]);

            if (!allRequiredKeysExist(clean, ["question", "answers"])) {
                res.status(400).json({ code: 400, err: "BAD_REQUEST", message: "Not enough paramaters supplied" });
                return;
            }

            if (!(arr => {
                return Object.prototype.toString.call(arr) === '[object Array]';
            })(clean.answers)) {
                res.status(400).json({ code: 400, err: "BAD_REQUEST", message: "Bad request (answers not an array)" });
                return;
            }

            var is_correct_count = 0;

            clean.answers.forEach((ans, index, arr) => {
                arr[index] = cleanUpInput(ans, ["answer", "is_correct"]);

                if (arr[index].is_correct === true) { is_correct_count++; }

                if (Object.keys(arr[index]).length < 1) { arr[index] = null; }
            });

            clean.answers = clean.answers.filter(val => { return val !== null; });

            if (clean.answers.length < 1) {
                res.status(400).json({ code: 400, err: "BAD_REQUEST", message: "Not enough answers supplied" });
                return;
            }

            if (is_correct_count < 1) {
                res.status(400).json({ code: 400, err: "BAD_REQUEST", message: "No correct answers supplied" });
                return;
            }

            clean.FK_themeId = req.params.themeId;
            clean.answers = JSON.stringify(clean.answers);

            connection.query('INSERT INTO `questions` SET ? RETURNING `questions`.`id`, `questions`.`question`, `questions`.`answers`',
                [clean],
                (err, rows, fields) => {
                    if (err) {
                        if (err.code == 'ER_NO_REFERENCED_ROW_2') { // technically should never trigger
                            res.status(404).json(not_found_error);
                            return;
                        }

                        error500(err, req, res, null);
                        return;
                    }

                    if (rows.length < 1) {
                        error500(err, req, res, null);
                        return;
                    }

                    rows.forEach(element => {
                        element.answers = JSON.parse(element.answers);
                    });

                    res.location(api_header + "/topics/" + req.params.topicId + "/themes/" + req.params.themeId + "/questions/" + rows[0].id).status(201).json(rows[0]);
                });
        });
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

// hierarchinis
app.get(api_header + '/topics/:topicId/questions', (req, res) => {
    connection.query('SELECT 1 FROM `topics` WHERE `id` = ?;',
        [req.params.topicId],
        (err, rows, fields) => {
            if (err) {
                error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(not_found_error);
                return;
            }

            connection.query('SELECT `questions`.`id`, `questions`.`FK_themeId` as themeId, `questions`.`question`, `questions`.`answers`, `themes`.`name`, `themes`.`description` FROM `questions` LEFT JOIN `themes` ON `questions`.`FK_themeId` = `themes`.`id` WHERE `themes`.`FK_topicId` = ?;',
                [req.params.topicId],
                (err, rows, fields) => {
                    if (err) {
                        error500(err, req, res, null);
                        return;
                    }

                    // potentially with no answers here?
                    rows.forEach(element => {
                        element.answers = JSON.parse(element.answers);
                        // delete element.answers;

                        element.theme = {};
                        element.theme.id = element.themeId;
                        element.theme.name = element.name;
                        element.theme.description = element.description;

                        delete element.themeId;
                        delete element.name;
                        delete element.description;
                    });

                    res.status(200).json(rows);
                });
        });
});

// miscellaneous
app.listen(port, () => {
    console.log(`Klausimėlis listening on port ${port}`);
});

app.use((req, res, next) => {
    res.status(404).json(not_found_error);
});

app.use(function (err, req, res, next) {
    if (err.type == "entity.parse.failed") {
        res.status(400).json({ code: 400, err: "BAD_REQUEST", message: "JSON parsing failed" });
        return;
    }

    error500(err, req, res, next);
    return;
});

function error500(err, req, res, next) {
    console.error(err);
    res.status(500).json({ code: 500, err: "SERVER_ERROR", message: "Internal Server Error" });
}

function cleanUpInput(object, valid_keys) {
    var ret = {};

    valid_keys.forEach(key => { if (object[key] != null) ret[key] = object[key]; });

    return ret;
}

function allRequiredKeysExist(object, required_keys) {
    for (var key of required_keys) {
        if (object[key] == null) {
            return false;
        }
    }

    return true;
}