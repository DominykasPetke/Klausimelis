/*jshint node: true */
/*jshint esversion: 6 */
"use strict";

const misc = require("./misc");
const connection = require("./db");

const express = require("express");
const router = express.Router();

const passport = require("passport");

// topics
router.get("/topics", (req, res) => {
  connection.query(
    "SELECT `topics`.`id`, `name`, `description`, `FK_userId`, `username` FROM `topics` LEFT JOIN `users` ON `topics`.`FK_userId` = `users`.`id`;",
    (err, rows, fields) => {
      if (err) {
        misc.error500(err, req, res, null);
        return;
      }

      rows.forEach((element) => {
        element.user = { id: element.FK_userId, username: element.username };

        delete element.FK_userId;
        delete element.username;
      });

      res.status(200).json(rows);
    }
  );
});

router.get("/topics/:topicId", (req, res) => {
  connection.query(
    "SELECT `topics`.`id`, `name`, `description`, `FK_userId`, `username` FROM `topics` LEFT JOIN `users` ON `topics`.`FK_userId` = `users`.`id` WHERE `topics`.`id` = ? ;",
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

      rows.forEach((element) => {
        element.user = { id: element.FK_userId, username: element.username };

        delete element.FK_userId;
        delete element.username;
      });

      res.status(200).json(rows[0]);
    }
  );
});

router.post("/topics", passport.authenticate("jwt"), (req, res) => {
  if (req.user.role < 2) {
    // if not admin
    res.status(403).json(misc.forbidden_error);
    return;
  }

  var clean = misc.cleanUpInput(req.body, ["name", "description"]);

  if (!misc.allRequiredKeysExist(clean, ["name"])) {
    res
      .status(400)
      .json({
        code: 400,
        err: "BAD_REQUEST",
        message: "Not enough paramaters supplied",
      });
    return;
  }

  clean.FK_userId = req.user.id;

  connection.query(
    "INSERT INTO `topics` SET ?;",
    [clean],
    (err, rows, fields) => {
      if (err) {
        misc.error500(err, req, res, null);
        return;
      }

      connection.query(
        "SELECT `topics`.`id`, `name`, `description`, `FK_userId`, `username` FROM `topics` LEFT JOIN `users` ON `topics`.`FK_userId` = `users`.`id` WHERE `topics`.`id`= LAST_INSERT_ID();",
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

          rows.forEach((element) => {
            element.user = {
              id: element.FK_userId,
              username: element.username,
            };

            delete element.FK_userId;
            delete element.username;
          });

          res
            .location("/topics/" + rows[0].id)
            .status(201)
            .json(rows[0]);
        }
      );
    }
  );
});

router.patch("/topics/:topicId", passport.authenticate("jwt"), (req, res) => {
  if (req.user.role < 2) {
    // if not admin
    res.status(403).json(misc.forbidden_error);
    return;
  }

  connection.query(
    "SELECT `id` FROM `topics` WHERE `id` = ?;",
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

      var clean = misc.cleanUpInput(req.body, ["name", "description"]);

      if (Object.keys(clean).length < 1) {
        res
          .status(400)
          .json({
            code: 400,
            err: "BAD_REQUEST",
            message: "Not enough paramaters supplied",
          });
        return;
      }

      clean.FK_userId = req.user.id;

      connection.query(
        "UPDATE `topics` SET ? WHERE `id` = ?;",
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
        }
      );
    }
  );
});

router.delete("/topics/:topicId", passport.authenticate("jwt"), (req, res) => {
  if (req.user.role < 2) {
    // if not admin
    res.status(403).json(misc.forbidden_error);
    return;
  }

  connection.query(
    "SELECT `id` FROM `topics` WHERE `id` = ?;",
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

      connection.query(
        "DELETE FROM `topics` WHERE `id` = ?;",
        [req.params.topicId],
        (err, rows, fields) => {
          if (err) {
            misc.error500(err, req, res, null);
            return;
          }

          res.sendStatus(204);
        }
      );
    }
  );
});

// themes
router.get("/topics/:topicId/themes", (req, res) => {
  connection.query(
    "SELECT `id` FROM `topics` WHERE `id` = ?;",
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

      connection.query(
        "SELECT `themes`.`id`, `name`, `description`, `FK_userId`, `username` FROM `themes` LEFT JOIN `users` ON `themes`.`FK_userId` = `users`.`id` WHERE `FK_topicId` = ?;",
        [req.params.topicId],
        (err, rows, fields) => {
          if (err) {
            misc.error500(err, req, res, null);
            return;
          }

          rows.forEach((element) => {
            element.user = {
              id: element.FK_userId,
              username: element.username,
            };

            delete element.FK_userId;
            delete element.username;
          });

          res.status(200).json(rows);
        }
      );
    }
  );
});

router.get("/topics/:topicId/themes/:themeId", (req, res) => {
  connection.query(
    "SELECT `themes`.`id`, `name`, `description`, `FK_topicId`, `FK_userId`, `username` FROM `themes` LEFT JOIN `users` ON `themes`.`FK_userId` = `users`.`id` WHERE `FK_topicId` = ? AND `themes`.`id` = ?;",
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

      if (
        rows[0].id != req.params.themeId ||
        rows[0].FK_topicId != req.params.topicId
      ) {
        res.status(404).json(misc.not_found_error);
        return;
      }

      rows.forEach((element) => {
        element.user = { id: element.FK_userId, username: element.username };

        delete element.FK_topicId;
        delete element.FK_userId;
        delete element.username;
      });

      res.status(200).json(rows[0]);
    }
  );
});

router.post(
  "/topics/:topicId/themes",
  passport.authenticate("jwt"),
  (req, res) => {
    if (req.user.role < 1) {
      // if not teacher
      res.status(403).json(misc.forbidden_error);
      return;
    }

    connection.query(
      "SELECT `id` FROM `topics` WHERE `id` = ?;",
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

        var clean = misc.cleanUpInput(req.body, ["name", "description"]);

        if (!misc.allRequiredKeysExist(clean, ["name"])) {
          res
            .status(400)
            .json({
              code: 400,
              err: "BAD_REQUEST",
              message: "Not enough paramaters supplied",
            });
          return;
        }

        clean.FK_topicId = req.params.topicId;
        clean.FK_userId = req.user.id;

        connection.query(
          "INSERT INTO `themes` SET ?;",
          [clean],
          (err, rows, fields) => {
            if (err) {
              if (err.code == "ER_NO_REFERENCED_ROW_2") {
                res.status(404).json(misc.not_found_error);
                return;
              }

              misc.error500(err, req, res, null);
              return;
            }

            connection.query(
              "SELECT `themes`.`id`, `name`, `description`, `FK_userId`, `username` FROM `themes` LEFT JOIN `users` ON `themes`.`FK_userId` = `users`.`id` WHERE `themes`.`id`= LAST_INSERT_ID();",
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

                rows.forEach((element) => {
                  element.user = {
                    id: element.FK_userId,
                    username: element.username,
                  };

                  delete element.FK_topicId;
                  delete element.FK_userId;
                  delete element.username;
                });

                res
                  .location(
                    "/topics/" + req.params.topicId + "/themes/" + rows[0].id
                  )
                  .status(201)
                  .json(rows[0]);
              }
            );
          }
        );
      }
    );
  }
);

router.patch(
  "/topics/:topicId/themes/:themeId",
  passport.authenticate("jwt"),
  (req, res) => {
    if (req.user.role < 1) {
      // if not teacher
      res.status(403).json(misc.forbidden_error);
      return;
    }

    connection.query(
      "SELECT `FK_topicId`, `id`, `FK_userId` FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;",
      [req.params.topicId, req.params.themeId],
      (err, rows, fields) => {
        if (err) {
          misc.error500(err, req, res, null);
          return;
        }

        if (
          req.user.role < 2 &&
          rows.length > 0 &&
          req.user.id != rows[0].FK_userId
        ) {
          // if wrong teacher
          res.status(403).json(misc.forbidden_error);
          return;
        }

        if (rows.length < 1) {
          res.status(404).json(misc.not_found_error);
          return;
        }

        if (
          rows[0].id != req.params.themeId ||
          rows[0].FK_topicId != req.params.topicId
        ) {
          res.status(404).json(misc.not_found_error);
          return;
        }

        var clean = misc.cleanUpInput(req.body, ["name", "description"]);

        if (Object.keys(clean).length < 1) {
          res
            .status(400)
            .json({
              code: 400,
              err: "BAD_REQUEST",
              message: "Not enough paramaters supplied",
            });
          return;
        }

        connection.query(
          "UPDATE `themes` SET ? WHERE `FK_topicId` = ? AND `id` = ?;",
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
          }
        );
      }
    );
  }
);

router.delete(
  "/topics/:topicId/themes/:themeId",
  passport.authenticate("jwt"),
  (req, res) => {
    if (req.user.role < 1) {
      // if not teacher
      res.status(403).json(misc.forbidden_error);
      return;
    }

    connection.query(
      "SELECT `FK_topicId`, `id`, `FK_userId` FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;",
      [req.params.topicId, req.params.themeId],
      (err, rows, fields) => {
        if (err) {
          misc.error500(err, req, res, null);
          return;
        }

        if (
          req.user.role < 2 &&
          rows.length > 0 &&
          req.user.id != rows[0].FK_userId
        ) {
          // if wrong teacher
          res.status(403).json(misc.forbidden_error);
          return;
        }

        if (rows.length < 1) {
          res.status(404).json(misc.not_found_error);
          return;
        }

        if (
          rows[0].id != req.params.themeId ||
          rows[0].FK_topicId != req.params.topicId
        ) {
          res.status(404).json(misc.not_found_error);
          return;
        }

        connection.query(
          "DELETE FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;",
          [req.params.topicId, req.params.themeId],
          (err, rows, fields) => {
            if (err) {
              misc.error500(err, req, res, null);
              return;
            }

            res.sendStatus(204);
          }
        );
      }
    );
  }
);

// questions
router.get(
  "/topics/:topicId/themes/:themeId/questions",
  passport.authenticate(["jwt", "anonymous"]),
  (req, res) => {
    connection.query(
      "SELECT `FK_topicId`, `id` FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;",
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

        if (
          rows[0].id != req.params.themeId ||
          rows[0].FK_topicId != req.params.topicId
        ) {
          res.status(404).json(misc.not_found_error);
          return;
        }

        connection.query(
          "SELECT `questions`.`id`, `question`, `FK_themeId`, `answers`, `FK_userId`, `username` FROM `questions` LEFT JOIN `users` ON `questions`.`FK_userId` = `users`.`id` WHERE `FK_themeId` = ?;",
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

            rows.forEach((element) => {
              element.user = {
                id: element.FK_userId,
                username: element.username,
              };

              delete element.FK_userId;
              delete element.username;
              delete element.FK_themeId;

              if (req.user) {
                element.answers = JSON.parse(element.answers);
              } else {
                delete element.answers;
              }
            });

            res.status(200).json(rows);
          }
        );
      }
    );
  }
);

router.get(
  "/topics/:topicId/themes/:themeId/questions/:questionId",
  passport.authenticate(["jwt", "anonymous"]),
  (req, res) => {
    connection.query(
      "SELECT `FK_topicId`, `id` FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;",
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

        if (
          rows[0].id != req.params.themeId ||
          rows[0].FK_topicId != req.params.topicId
        ) {
          res.status(404).json(misc.not_found_error);
          return;
        }

        connection.query(
          "SELECT `questions`.`id`, `question`, `answers`, `FK_userId`, `username` FROM `questions` LEFT JOIN `users` ON `questions`.`FK_userId` = `users`.`id` WHERE `FK_themeId` = ? AND `questions`.`id` = ?",
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

            rows.forEach((element) => {
              element.user = {
                id: element.FK_userId,
                username: element.username,
              };

              delete element.FK_userId;
              delete element.username;
              delete element.FK_themeId;

              if (req.user) {
                element.answers = JSON.parse(element.answers);
              } else {
                delete element.answers;
              }
            });

            res.status(200).json(rows[0]);
          }
        );
      }
    );
  }
);

router.post(
  "/topics/:topicId/themes/:themeId/questions",
  passport.authenticate("jwt"),
  (req, res) => {
    if (req.user.role < 1) {
      // if not teacher
      res.status(403).json(misc.forbidden_error);
      return;
    }

    connection.query(
      "SELECT `FK_topicId`, `id`, `FK_userId` FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;",
      [req.params.topicId, req.params.themeId],
      (err, rows, fields) => {
        if (err) {
          misc.error500(err, req, res, null);
          return;
        }

        if (
          req.user.role < 2 &&
          rows.length > 0 &&
          req.user.id != rows[0].FK_userId
        ) {
          // if wrong teacher
          res.status(403).json(misc.forbidden_error);
          return;
        }

        if (rows.length < 1) {
          res.status(404).json(misc.not_found_error);
          return;
        }

        if (
          rows[0].id != req.params.themeId ||
          rows[0].FK_topicId != req.params.topicId
        ) {
          res.status(404).json(misc.not_found_error);
          return;
        }

        var clean = questionCleanup(req, res);

        if (!clean) {
          return;
        }

        clean.FK_userId = req.user.id;

        connection.query(
          "INSERT INTO `questions` SET ?;",
          [clean],
          (err, rows, fields) => {
            if (err) {
              if (err.code == "ER_NO_REFERENCED_ROW_2") {
                // technically should never trigger
                res.status(404).json(misc.not_found_error);
                return;
              }

              misc.error500(err, req, res, null);
              return;
            }

            connection.query(
              "SELECT `questions`.`id`, `questions`.`question`, `questions`.`answers` FROM `questions` WHERE `id`= LAST_INSERT_ID();",
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

                rows.forEach((element) => {
                  element.answers = JSON.parse(element.answers);
                });

                res
                  .location(
                    "/topics/" +
                      req.params.topicId +
                      "/themes/" +
                      req.params.themeId +
                      "/questions/" +
                      rows[0].id
                  )
                  .status(201)
                  .json(rows[0]);
              }
            );
          }
        );
      }
    );
  }
);

router.put(
  "/topics/:topicId/themes/:themeId/questions/:questionId",
  passport.authenticate("jwt"),
  (req, res) => {
    if (req.user.role < 1) {
      // if not teacher
      res.status(403).json(misc.forbidden_error);
      return;
    }

    connection.query(
      "SELECT `FK_topicId`, `id` FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;",
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

        if (
          rows[0].id != req.params.themeId ||
          rows[0].FK_topicId != req.params.topicId
        ) {
          res.status(404).json(misc.not_found_error);
          return;
        }

        connection.query(
          "SELECT `FK_themeId`, `id`, `FK_userId` FROM `questions` WHERE `FK_themeId` = ? AND `id` = ?;",
          [req.params.themeId, req.params.questionId],
          (err, rows, fields) => {
            if (err) {
              misc.error500(err, req, res, null);
              return;
            }

            if (
              req.user.role < 2 &&
              rows.length > 0 &&
              req.user.id != rows[0].FK_userId
            ) {
              // if wrong teacher
              res.status(403).json(misc.forbidden_error);
              return;
            }

            if (rows.length < 1) {
              res.status(404).json(misc.not_found_error);
              return;
            }

            if (
              rows[0].id != req.params.questionId ||
              rows[0].FK_themeId != req.params.themeId
            ) {
              res.status(404).json(misc.not_found_error);
              return;
            }

            var clean = questionCleanup(req, res);

            if (!clean) {
              return;
            }

            connection.query(
              "UPDATE `questions` SET ? WHERE `FK_themeId` = ? AND `id` = ?",
              [clean, req.params.themeId, req.params.questionId],
              (err, rows, fields) => {
                if (err) {
                  if (err.code == "ER_NO_REFERENCED_ROW_2") {
                    // technically should never trigger
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
              }
            );
          }
        );
      }
    );
  }
);

router.delete(
  "/topics/:topicId/themes/:themeId/questions/:questionId",
  passport.authenticate("jwt"),
  (req, res) => {
    if (req.user.role < 1) {
      // if not teacher
      res.status(403).json(misc.forbidden_error);
      return;
    }

    connection.query(
      "SELECT `FK_topicId`, `id` FROM `themes` WHERE `FK_topicId` = ? AND `id` = ?;",
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

        if (
          rows[0].id != req.params.themeId ||
          rows[0].FK_topicId != req.params.topicId
        ) {
          res.status(404).json(misc.not_found_error);
          return;
        }

        connection.query(
          "SELECT `FK_themeId`, `id`, `FK_userId` FROM `questions` WHERE `FK_themeId` = ? AND `id` = ?;",
          [req.params.themeId, req.params.questionId],
          (err, rows, fields) => {
            if (err) {
              misc.error500(err, req, res, null);
              return;
            }

            if (
              req.user.role < 2 &&
              rows.length > 0 &&
              req.user.id != rows[0].FK_userId
            ) {
              // if wrong teacher
              res.status(403).json(misc.forbidden_error);
              return;
            }

            if (rows.length < 1) {
              res.status(404).json(misc.not_found_error);
              return;
            }

            if (
              rows[0].id != req.params.questionId ||
              rows[0].FK_themeId != req.params.themeId
            ) {
              res.status(404).json(misc.not_found_error);
              return;
            }

            connection.query(
              "DELETE FROM `questions` WHERE `FK_themeId` = ? AND `id` = ?;",
              [req.params.themeId, req.params.questionId],
              (err, rows, fields) => {
                if (err) {
                  misc.error500(err, req, res, null);
                  return;
                }

                res.sendStatus(204);
              }
            );
          }
        );
      }
    );
  }
);

// hierarchinis
router.get(
  "/topics/:topicId/questions",
  passport.authenticate(["jwt", "anonymous"]),
  (req, res) => {
    connection.query(
      "SELECT `id` FROM `topics` WHERE `id` = ?;",
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

        connection.query(
          "SELECT `questions`.`id`, `FK_themeId` as themeId, `question`, `answers`, `name`, `description`, `questions`.`FK_userId`, `username` FROM `questions` LEFT JOIN `themes` ON `questions`.`FK_themeId` = `themes`.`id` LEFT JOIN `users` ON `questions`.`FK_userId` = `users`.`id` WHERE `themes`.`FK_topicId` = ?;",
          [req.params.topicId],
          (err, rows, fields) => {
            if (err) {
              misc.error500(err, req, res, null);
              return;
            }

            rows.forEach((element) => {
              element.user = {
                id: element.FK_userId,
                username: element.username,
              };

              delete element.FK_userId;
              delete element.username;

              if (req.user) {
                element.answers = JSON.parse(element.answers);
              } else {
                delete element.answers;
              }

              element.theme = {};
              element.theme.id = element.themeId;
              element.theme.name = element.name;
              element.theme.description = element.description;

              delete element.themeId;
              delete element.name;
              delete element.description;
            });

            res.status(200).json(rows);
          }
        );
      }
    );
  }
);

function questionCleanup(req, res) {
  var clean = misc.cleanUpInput(req.body, ["question", "answers"]);

  if (!misc.allRequiredKeysExist(clean, ["question", "answers"])) {
    res
      .status(400)
      .json({
        code: 400,
        err: "BAD_REQUEST",
        message: "Not enough paramaters supplied",
      });
    return false;
  }

  if (
    !((arr) => {
      return Object.prototype.toString.call(arr) === "[object Array]";
    })(clean.answers)
  ) {
    res
      .status(400)
      .json({
        code: 400,
        err: "BAD_REQUEST",
        message: "Bad request (answers not an array)",
      });
    return false;
  }

  var is_correct_count = 0;

  clean.answers.forEach((ans, index, arr) => {
    arr[index] = misc.cleanUpInput(ans, ["answer", "is_correct"]);

    if (arr[index].is_correct === true) {
      is_correct_count++;
    }

    if (Object.keys(arr[index]).length < 1) {
      arr[index] = null;
    }
  });

  clean.answers = clean.answers.filter((val) => {
    return val !== null;
  });

  if (clean.answers.length < 1) {
    res
      .status(400)
      .json({
        code: 400,
        err: "BAD_REQUEST",
        message: "Not enough answers supplied",
      });
    return false;
  }

  if (is_correct_count < 1) {
    res
      .status(400)
      .json({
        code: 400,
        err: "BAD_REQUEST",
        message: "No correct answers supplied",
      });
    return false;
  }

  clean.FK_themeId = req.params.themeId;
  clean.answers = JSON.stringify(clean.answers);

  return clean;
}

module.exports = router;
