/* jslint node: true */
/*jshint esversion: 6 */
"use strict";

const models = {};

models.userModel = require('./user.js')();
models.favoriteModel = require('./favorite.js')();
models.stockModel = require('./stock.js')();
models.commentModel = require('./comment.js')();

models.stockModel.hasMany(models.favoriteModel);
models.favoriteModel.belongsTo(models.stockModel);
//models.stockModel.hasMany(models.commentModel);

models.commentModel.belongsTo(models.userModel);

module.exports = models;
