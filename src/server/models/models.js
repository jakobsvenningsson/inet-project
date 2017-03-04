/* jslint node: true */
/*jshint esversion: 6 */
"use strict";

const db = require('../sequelize.js');

const models = {};

models.userModel = require('./user.js')();
models.favoriteModel = require('./favorite.js')();
models.stockModel = require('./stock.js')();
models.commentModel = require('./comment.js')();

models.stockModel.hasMany(models.favoriteModel);
models.commentModel.belongsTo(models.userModel);
models.stockModel.hasMany(models.commentModel);

module.exports = models;
