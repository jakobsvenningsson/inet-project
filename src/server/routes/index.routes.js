/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const sequelize = require('../sequelize.js').sequelize;
const favoriteModel = require('../models/models.js').favoriteModel;
const stockModel = require('../models/models.js').stockModel;

const passport = require('passport');
const debug = require('debug')('debug');

module.exports = function(io){

  //router.use('/', require('./favorite.routes.js'));
  router.use('/', require('./comment.routes.js')(io));
  router.use('/', require('./user.routes.js'));
  router.use('/', require('./stock.routes.js'));

  router.post('/favorite/add', passport.authenticate('jwt', { session: false }), function(req, res){
    debug(req.body);
    favoriteModel.findOne({
      where: {userId:req.body.user, stockId:req.body.stock}
    })
    .then(function(favorite){
      console.log(req.body);
      if(favorite){
        res.status(200).send("favorite already in DB");
      }else{
        return favoriteModel.create(req.body);
      }
    })
    .then(function(favorite){
      io.to(req.body.user).emit('addFavorite', favorite.get());
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
      where: {userId:req.body.userId, stockId:req.body.stockId}
    })
      .then(function(favorite){
        io.to(req.body.user).emit('removeFavorite', favorite.get());
        favorite.destroy();
        res.status(200).send("Favorite removed!");
      })
      .catch(function(err){
        debug(err);
        res.status(400).send(err);
      });
  });

  router.get('/favorite/get/:id', passport.authenticate('jwt', { session: false }), function(req, res){
    favoriteModel.findAll({
      where: {userId:req.params.id}
    })
    .then(function(data){
      res.status(200).send(data);
    })
    .catch(function(err){
      debug(err);
      res.status(400).send(err);
    });
  });

  router.get('/favorite/', passport.authenticate('jwt', { session: false }), function(req, res){
    debug("inside favorite top");
    stockModel.findAll({
      attributes: ['name','symbol','id','exchange',[sequelize.fn('COUNT',sequelize.col('favorites.userId')), 'favoriteCount']],
      include: [{
          model: favoriteModel,
          as: 'favorites',
          attributess:[],
          duplicating: false,
          required: false
      }],
      group: ['id'],
      order: [[sequelize.fn('COUNT',sequelize.col('favorites.userId')), 'DESC']],
      limit: 10
    })
    .then(function(data){
      res.status(200).send(data);
    })
    .catch(function(err){
      debug(err);
      res.status(400).send(err);
    });
  });

  return router;
};
