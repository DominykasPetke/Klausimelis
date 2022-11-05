/*jshint node: true */
/*jshint esversion: 6 */
'use strict';

module.exports.not_implemented_error = { code: 501, err: "NOT_IMPLEMENTED", message: "Not implemented (yet)" };
module.exports.not_found_error = { code: 404, err: "NOT_FOUND", message: "Page not found" };

module.exports.error500 = function (err, req, res, next) {
    console.error(err);
    res.status(500).json({ code: 500, err: "SERVER_ERROR", message: "Internal Server Error" });
};

module.exports.allRequiredKeysExist = function (object, required_keys) {
    for (var key of required_keys) {
        if (object[key] == null) {
            return false;
        }
    }

    return true;
};
