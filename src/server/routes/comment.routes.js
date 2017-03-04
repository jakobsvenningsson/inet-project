/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const commentModel = require('../models/comment.js')();
const passport = require('passport');
const debug = require('debug')('debug');

module.exports = function(io){
  router.post('/comments/submit', passport.authenticate('jwt', { session: false }), function(req, res){
    commentModel.create(req.body)
      .then(function(data){
        debug("Emitting comment" + data);
        debug(data.stock);
        io.to(data.stock).emit('newComment', data);
        res.status(200).send("Comment submitted");
      })
      .catch(function(err){
        debug(err);
        res.status(400).send(err);
      });
  });

  router.get('/comments/:id', passport.authenticate('jwt', { session: false }),  function(req, res){
    commentModel.findAll({
      where:{stock:req.params.id}
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
