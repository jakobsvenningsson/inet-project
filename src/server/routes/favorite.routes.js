/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const favoriteModel = require('../models/models.js').favoriteModel;
const passport = require('passport');
const debug = require('debug')('debug');

module.exports = function(io){
  router.post('/favorite/add', passport.authenticate('jwt', { session: false }), function(req, res){
    debug(req.body);
    favoriteModel.findOne({
      where: {userId:req.body.user, stockId:req.body.stock}
    })
    .then(function(favorite){
      if(favorite){
        res.status(200).send("favorite already in DB");
      }else{
        return favoriteModel.create(req.body);
      }
    })
    .then(function(favorite){
        debug("-----");
        debug(favorite);
        io.to(favorite.userId).emit('addFavorite', favorite);
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
      where: {userId:req.body.user, stockId:req.body.stock}
    })
      .then(function(data){
        data.destroy();
        console.log(data);
        io.to(data.userId).emit('removeFavorite', favorite);
        res.status(200).send("Favorite removed!");
      })
      .catch(function(err){
        debug(err);
        res.status(400).send(err);
      });
  });


  return router;
};
