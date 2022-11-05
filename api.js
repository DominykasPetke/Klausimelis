/*jshint node: true */
/*jshint esversion: 6 */
'use strict';

const misc = require('./misc');
const connection = require('./db');

const express = require('express');
const router = express.Router();

// topics
router.get('/topics', (req, res) => {
    connection.query('SELECT * FROM `topics`;', (err, rows, fields) => {
        if (err) {
            misc.error500(err, req, res, null);
            return;
        }

        res.status(200).json(rows);
    });
});

router.get('/topics/:topicId', (req, res) => {
    connection.query('SELECT * FROM `topics` WHERE `id` = ?;',
        [req.params.topicId],
        (err, rows, fields) => {
            if (err) {
                misc.error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            if (rows[0].id != req.params.topicId) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            res.status(200).json(rows[0]);
        });
});

router.post('/topics', (req, res) => {
    var clean = cleanUpInput(req.body, ["name", "description"]);

    if (!misc.allRequiredKeysExist(clean, ["name"])) {
        res.status(400).json({ code: 400, err: "BAD_REQUEST", message: "Not enough paramaters supplied" });
        return;
    }

    connection.query('INSERT INTO `topics` SET ?;',
        [clean],
        (err, rows, fields) => {
            if (err) {
                misc.error500(err, req, res, null);
                return;
            }

            connection.query('SELECT * FROM `topics` WHERE `id`= LAST_INSERT_ID();',
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

                    res.location("/topics/" + rows[0].id).status(201).json(rows[0]);
                });
        });
});

router.patch('/topics/:topicId', (req, res) => {
    connection.query('SELECT `id` FROM `topics` WHERE `id` = ?;',
        [req.params.topicId],
        (err, rows, fields) => {
            if (err) {
                misc.error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            if (rows[0].id != req.params.topicId) {
                res.status(404).json(misc.not_found_error);
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
                        misc.error500(err, req, res, null);
                        return;
                    }

                    if (rows.length < 1) {
                        misc.error500(err, req, res, null);
                        return;
                    }

                    res.sendStatus(204);
                });
        });
});

router.delete('/topics/:topicId', (req, res) => {
    connection.query('SELECT `id` FROM `topics` WHERE `id` = ?;',
        [req.params.topicId, req.params.themeId],
        (err, rows, fields) => {
            if (err) {
                misc.error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            if (rows[0].id != req.params.topicId) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            connection.query('DELETE FROM `topics` WHERE `id` = ?;',
                [req.params.topicId],
                (err, rows, fields) => {
                    if (err) {
                        misc.error500(err, req, res, null);
                        return;
                    }

                    res.sendStatus(204);
                });
        });
});

// themes
router.get('/topics/:topicId/themes', (req, res) => {
    connection.query('SELECT `id` FROM `topics` WHERE `id` = ?;',
        [req.params.topicId],
        (err, rows, fields) => {
            if (err) {
                misc.error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            if (rows[0].id != req.params.topicId) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            connection.query('SELECT `themes`.`id`, `themes`.`name`, `themes`.`description` FROM `themes` WHERE `FK_topicId` = ?;',
                [req.params.topicId],
                (err, rows, fields) => {
                    if (err) {
                        misc.error500(err, req, res, null);
                        return;
                    }

                    res.status(200).json(rows);
                });
        });
});

router.get('/topics/:topicId/themes/:themeId', (req, res) => {
    connection.query('SELECT `themes`.`id`, `themes`.`name`, `themes`.`description`, `themes`.`FK_topicId` FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;',
        [req.params.topicId, req.params.themeId],
        (err, rows, fields) => {
            if (err) {
                misc.error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            if (rows[0].id != req.params.themeId || rows[0].FK_topicId != req.params.topicId) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            delete rows[0].FK_topicId;

            res.status(200).json(rows[0]);
        });
});

router.post('/topics/:topicId/themes', (req, res) => {
    connection.query('SELECT `id` FROM `topics` WHERE `id` = ?;',
        [req.params.topicId],
        (err, rows, fields) => {
            if (err) {
                misc.error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            if (rows[0].id != req.params.topicId) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            var clean = cleanUpInput(req.body, ["name", "description"]);

            if (!misc.allRequiredKeysExist(clean, ["name"])) {
                res.status(400).json({ code: 400, err: "BAD_REQUEST", message: "Not enough paramaters supplied" });
                return;
            }

            clean.FK_topicId = req.params.topicId;

            connection.query('INSERT INTO `themes` SET ?;',
                [clean],
                (err, rows, fields) => {
                    if (err) {
                        if (err.code == 'ER_NO_REFERENCED_ROW_2') {
                            res.status(404).json(misc.not_found_error);
                            return;
                        }

                        misc.error500(err, req, res, null);
                        return;
                    }

                    connection.query('SELECT `themes`.`id`, `themes`.`name`, `themes`.`description` FROM `themes` WHERE `id`= LAST_INSERT_ID();',
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

                            res.location("/topics/" + req.params.topicId + "/themes/" + rows[0].id).status(201).json(rows[0]);
                        });
                });
        });
});

router.patch('/topics/:topicId/themes/:themeId', (req, res) => {
    connection.query('SELECT `FK_topicId`, `id` FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;',
        [req.params.topicId, req.params.themeId],
        (err, rows, fields) => {
            if (err) {
                misc.error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            if (rows[0].id != req.params.themeId || rows[0].FK_topicId != req.params.topicId) {
                res.status(404).json(misc.not_found_error);
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
                        misc.error500(err, req, res, null);
                        return;
                    }

                    if (rows.length < 1) {
                        misc.error500(err, req, res, null);
                        return;
                    }

                    res.sendStatus(204);
                });
        });
});

router.delete('/topics/:topicId/themes/:themeId', (req, res) => {
    connection.query('SELECT `FK_topicId`, `id` FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;',
        [req.params.topicId, req.params.themeId],
        (err, rows, fields) => {
            if (err) {
                misc.error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            if (rows[0].id != req.params.themeId || rows[0].FK_topicId != req.params.topicId) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            connection.query('DELETE FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;',
                [req.params.topicId, req.params.themeId],
                (err, rows, fields) => {
                    if (err) {
                        misc.error500(err, req, res, null);
                        return;
                    }

                    res.sendStatus(204);
                });
        });
});

// questions
router.get('/topics/:topicId/themes/:themeId/questions', (req, res) => {
    connection.query('SELECT `FK_topicId`, `id` FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;',
        [req.params.topicId, req.params.themeId],
        (err, rows, fields) => {
            if (err) {
                misc.error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            if (rows[0].id != req.params.themeId || rows[0].FK_topicId != req.params.topicId) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            connection.query('SELECT `questions`.`id`, `questions`.`question`, `questions`.`FK_themeId`, `questions`.`answers` FROM `questions` WHERE `FK_themeId` = ?;',
                [req.params.themeId],
                (err, rows, fields) => {
                    if (err) {
                        misc.error500(err, req, res, null);
                        return;
                    }

                    if (rows[0].FK_themeId != req.params.themeId) {
                        res.status(404).json(misc.not_found_error);
                        return;
                    }

                    // potentially with no answers here?
                    rows.forEach(element => {
                        element.answers = JSON.parse(element.answers);
                        delete element.FK_themeId;
                        // delete element.answers;
                    });

                    res.status(200).json(rows);
                });
        });
});

router.get('/topics/:topicId/themes/:themeId/questions/:questionId', (req, res) => {
    // potentially include answers here?
    connection.query('SELECT `FK_topicId`, `id` FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;',
        [req.params.topicId, req.params.themeId],
        (err, rows, fields) => {
            if (err) {
                misc.error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            if (rows[0].id != req.params.themeId || rows[0].FK_topicId != req.params.topicId) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            connection.query('SELECT `questions`.`id`, `questions`.`question`, `questions`.`answers` FROM `questions` WHERE `FK_themeId` = ? AND `id` = ?',
                [req.params.themeId, req.params.questionId],
                (err, rows, fields) => {
                    if (err) {
                        misc.error500(err, req, res, null);
                        return;
                    }

                    if (rows.length < 1) {
                        res.status(404).json(misc.not_found_error);
                        return;
                    }

                    if (rows[0].id != req.params.questionId) {
                        res.status(404).json(misc.not_found_error);
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

router.post('/topics/:topicId/themes/:themeId/questions', (req, res) => {
    connection.query('SELECT `FK_topicId`, `id` FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;',
        [req.params.topicId, req.params.themeId],
        (err, rows, fields) => {
            if (err) {
                misc.error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            if (rows[0].id != req.params.themeId || rows[0].FK_topicId != req.params.topicId) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            var clean = questionCleanup(req, res);

            if (!clean) {
                return;
            }

            connection.query('INSERT INTO `questions` SET ?;',
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

                    connection.query('SELECT `questions`.`id`, `questions`.`question`, `questions`.`answers` FROM `questions` WHERE `id`= LAST_INSERT_ID();',
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

                            rows.forEach(element => {
                                element.answers = JSON.parse(element.answers);
                            });

                            res.location("/topics/" + req.params.topicId + "/themes/" + req.params.themeId + "/questions/" + rows[0].id).status(201).json(rows[0]);
                        });
                });
        });
});

router.put('/topics/:topicId/themes/:themeId/questions/:questionId', (req, res) => {
    connection.query('SELECT `FK_topicId`, `id` FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;',
        [req.params.topicId, req.params.themeId],
        (err, rows, fields) => {
            if (err) {
                misc.error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            if (rows[0].id != req.params.themeId || rows[0].FK_topicId != req.params.topicId) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            connection.query('SELECT `FK_themeId`, `id` FROM `questions` WHERE `FK_themeId` = ? AND `id` = ?;',
                [req.params.themeId, req.params.questionId],
                (err, rows, fields) => {
                    if (err) {
                        misc.error500(err, req, res, null);
                        return;
                    }

                    if (rows.length < 1) {
                        res.status(404).json(misc.not_found_error);
                        return;
                    }

                    if (rows[0].id != req.params.questionId || rows[0].FK_themeId != req.params.themeId) {
                        res.status(404).json(misc.not_found_error);
                        return;
                    }

                    var clean = questionCleanup(req, res);

                    if (!clean) {
                        return;
                    }

                    connection.query('UPDATE `questions` SET ? WHERE `FK_themeId` = ? AND `id` = ?',
                        [clean, req.params.themeId, req.params.questionId],
                        (err, rows, fields) => {
                            if (err) {
                                if (err.code == 'ER_NO_REFERENCED_ROW_2') { // technically should never trigger
                                    res.status(404).json(misc.not_found_error);
                                    return;
                                }

                                misc.error500(err, req, res, null);
                                return;
                            }

                            if (rows.length < 1) {
                                misc.error500(err, req, res, null);
                                return;
                            }

                            res.sendStatus(204);
                        });
                });
        });
});

router.delete('/topics/:topicId/themes/:themeId/questions/:questionId', (req, res) => {
    connection.query('SELECT `FK_topicId`, `id` FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;',
        [req.params.topicId, req.params.themeId],
        (err, rows, fields) => {
            if (err) {
                misc.error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            if (rows[0].id != req.params.themeId || rows[0].FK_topicId != req.params.topicId) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            connection.query('SELECT `FK_themeId`, `id` FROM `questions` WHERE `FK_themeId` = ? AND `id` = ?;',
                [req.params.themeId, req.params.questionId],
                (err, rows, fields) => {
                    if (err) {
                        misc.error500(err, req, res, null);
                        return;
                    }

                    if (rows.length < 1) {
                        res.status(404).json(misc.not_found_error);
                        return;
                    }

                    if (rows[0].id != req.params.questionId || rows[0].FK_themeId != req.params.themeId) {
                        res.status(404).json(misc.not_found_error);
                        return;
                    }

                    connection.query('DELETE FROM `questions` WHERE `FK_themeId` = ? AND `id` = ?;',
                        [req.params.themeId, req.params.questionId],
                        (err, rows, fields) => {
                            if (err) {
                                misc.error500(err, req, res, null);
                                return;
                            }

                            res.sendStatus(204);
                        });
                });
        });
});

// hierarchinis
router.get('/topics/:topicId/questions', (req, res) => {
    connection.query('SELECT `id` FROM `topics` WHERE `id` = ?;',
        [req.params.topicId],
        (err, rows, fields) => {
            if (err) {
                misc.error500(err, req, res, null);
                return;
            }

            if (rows.length < 1) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            if (rows[0].id != req.params.topicId) {
                res.status(404).json(misc.not_found_error);
                return;
            }

            connection.query('SELECT `questions`.`id`, `questions`.`FK_themeId` as themeId, `questions`.`question`, `questions`.`answers`, `themes`.`name`, `themes`.`description` FROM `questions` LEFT JOIN `themes` ON `questions`.`FK_themeId` = `themes`.`id` WHERE `themes`.`FK_topicId` = ?;',
                [req.params.topicId],
                (err, rows, fields) => {
                    if (err) {
                        misc.misc.error500(err, req, res, null);
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

function cleanUpInput(object, valid_keys) {
    var ret = {};

    valid_keys.forEach(key => { if (object[key] != null) ret[key] = object[key]; });

    return ret;
}

function questionCleanup(req, res) {
    var clean = cleanUpInput(req.body, ["question", "answers"]);

    if (!misc.allRequiredKeysExist(clean, ["question", "answers"])) {
        res.status(400).json({ code: 400, err: "BAD_REQUEST", message: "Not enough paramaters supplied" });
        return false;
    }

    if (!(arr => {
        return Object.prototype.toString.call(arr) === '[object Array]';
    })(clean.answers)) {
        res.status(400).json({ code: 400, err: "BAD_REQUEST", message: "Bad request (answers not an array)" });
        return false;
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
        return false;
    }

    if (is_correct_count < 1) {
        res.status(400).json({ code: 400, err: "BAD_REQUEST", message: "No correct answers supplied" });
        return false;
    }

    clean.FK_themeId = req.params.themeId;
    clean.answers = JSON.stringify(clean.answers);

    return clean;
}

module.exports = router;
