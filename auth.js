/*jshint node: true */
/*jshint esversion: 6 */
'use strict';

const misc = require('./misc');
const connection = require('./db');

const express = require('express');
const router = express.Router();

// OAuth
router.get('/token', (req, res) => {
  var ret = misc.not_implemented_error;
  ret.text = "Token";
  res.status(501).json(ret);
});

router.post('/login', (req, res) => {
  var ret = misc.not_implemented_error;
  ret.text = "Login";
  res.status(501).json(ret);
});

router.post('/register', (req, res) => {
  var ret = misc.not_implemented_error;
  ret.text = "Register";
  res.status(501).json(ret);
});

module.exports = router;
