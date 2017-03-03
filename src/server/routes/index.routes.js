/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();

module.exports = function(io){

  router.use('/', require('./comment.routes.js')(io));
  router.use('/', require('./user.routes.js'));
  router.use('/', require('./stock.routes.js'));

  return router;
};
