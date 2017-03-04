/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const favoriteModel = require('../models/favorite.js')();
const passport = require('passport');
const debug = require('debug')('debug');

module.exports = function(io){
  router.post('/favorite/add', passport.authenticate('jwt', { session: false }), function(req, res){
    debug(req.body);
    favoriteModel.findOne({
      where: {user:req.body.user, stock:req.body.stock}
    })
    .then(function(favorite){
      if(favorite){
        res.status(200).send("favorite already in DB");
      }else{
        return favoriteModel.create(req.body);
      }
    })
    .then(function(favorite){
        res.status(200).send("Favorite added!");
      })
    .catch(function(err){
      debug(err);
      res.status(400).send(err);
    });
  });

  router.post('/favorite/remove', passport.authenticate('jwt', { session: false }), function(req, res){
    debug(req.body);
    favoriteModel.findOne({
      where: {user:req.body.user, stock:req.body.stock}
    })
      .then(function(data){
        data.destroy();
        res.status(200).send("Favorite removed!");
      })
      .catch(function(err){
        debug(err);
        res.status(400).send(err);
      });
  });


  return router;
};
