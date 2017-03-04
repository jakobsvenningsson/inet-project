/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const commentModel = require('../models/models.js').commentModel;
const userModel = require('../models/models.js').userModel;

const passport = require('passport');
const debug = require('debug')('debug');

module.exports = function(io){

  router.post('/comments/submit', passport.authenticate('jwt', { session: false }), function(req, res){
    let comment = req.body;
    commentModel.create(req.body)
      .then(function(data){
        comment.timestamp = data.get().createdAt;
        res.status(200).send("Comment submitted");
        return userModel.findOne({
                  where: {id:data.get().userId}
                });
              })
                .then(function(user){
                  comment.name = user.name;
                  console.log(comment);
                  console.log(comment.stockId);
                  io.to(comment.stockId).emit('newComment', comment);
                })
                .catch(function(err){
                  debug(err);
                  res.status(400).send(err);
                });

});

  router.get('/comments/:id', passport.authenticate('jwt', { session: false }),  function(req, res){
    commentModel.findAll({
        include: [{
          model: userModel,
          attributes:['name'],
      }]
    })
      .then(function(comments){
        res.status(200).send(comments);
      })
      .catch(function(err){
        debug(err);
        res.status(400).send(err);
      });
  });

  return router;
};
