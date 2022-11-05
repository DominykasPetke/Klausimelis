/*jshint node: true */
/*jshint esversion: 6 */
'use strict';

const misc = require('./misc');

const express = require('express');
const router = express.Router();

// OAuth
router.get('/authorise', (req, res) => {
  var ret = misc.not_implemented_error;
  ret.text = "Auth";
  res.status(501).json(ret);
});

router.get('/token', (req, res) => {
  var ret = misc.not_implemented_error;
  ret.text = "Token";
  res.status(501).json(ret);
});

router.get('/login', (req, res) => {
  var ret = misc.not_implemented_error;
  ret.text = "Login";
  res.status(501).json(ret);
});

router.get('/register', (req, res) => {
  var ret = misc.not_implemented_error;
  ret.text = "Register";
  res.status(501).json(ret);
});
