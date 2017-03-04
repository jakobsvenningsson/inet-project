/* jslint node: true */
/*jshint esversion: 6 */
"use strict";

const express = require('express');
const router = express.Router();
const favoriteModel = require('../models/models.js').favoriteModel;
const stockModel = require('../models/models.js').stockModel;
const passport = require('passport');
const debug = require('debug')('debug');
const sequelize = require('../sequelize.js').sequelize;

module.exports = function(io) {

  router.post('/favorite/add', passport.authenticate('jwt', { session: false }), function(req, res) {
    favoriteModel.findOne({
      where: {userId: req.body.user, stockId: req.body.stock}
    })
    .then(function(favorite) {

      if(favorite) {
        res.status(200).send("favorite already in DB");
      } else {
        return favoriteModel.create(req.body);
      }
    })
    .then(function(favorite) {
      io.to(req.body.user).emit('addFavorite', favorite.get());
      res.status(200).send("Favorite added!");
    })
    .catch(function(err) {
      debug(err);
      res.status(400).send(err);
    });
  });

  router.delete('/favorite/remove/:user/:stock', passport.authenticate('jwt', { session: false }), function(req, res) {

    favoriteModel.findOne({
      where: {userId: req.params.user, stockId: req.params.stock}
    })
    .then(function(favorite){
      io.to(req.body.user).emit('removeFavorite', favorite.get());
      favorite.destroy();
      res.status(200).send("Favorite removed!");
    })
    .catch(function(err) {
      debug(err);
      res.status(400).send(err);
    });
  });

  router.get('/favorite/get/:id', passport.authenticate('jwt', { session: false }), function(req, res) {
    favoriteModel.findAll({
      where: {userId: req.params.id}
    })
    .then(function(data) {
      res.status(200).send(data);
    })
    .catch(function(err){
      debug(err);
      res.status(400).send(err);
    });
  });

  router.get('/favorite/', passport.authenticate('jwt', { session: false }), function(req, res) {

    stockModel.findAll({
         attributes: ['name','symbol','id','exchange',[sequelize.fn('COUNT',sequelize.col('favorites.userId')), 'favoriteCount']],
         include: [{
             model: favoriteModel,
             as: 'favorites',
             attributess:[],
             duplicating: false
         }],
         group: ['id'],
         order: [[sequelize.fn('COUNT',sequelize.col('favorites.userId')), 'DESC']],
         limit: 10
       })
    .then(function(data) {
      res.status(200).send(data);
    })
    .catch(function(err) {
      debug(err);
      res.status(400).send(err);
    });
  });

  return router;
};
