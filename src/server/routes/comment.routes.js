/* jslint node: true */
/*jshint esversion: 6 */
"use strict";

const express = require('express');
const router = express.Router();
const commentModel = require('../models/models.js').commentModel;
const userModel = require('../models/models.js').userModel;

const passport = require('passport');
const debug = require('debug')('debug');

module.exports = function(io){

router.post('/comments/submit', passport.authenticate('jwt', { session: false }),
  function(req, res) {
    let socketComment = req.body;
    commentModel.create(req.body)
      .then(function(data){
        socketComment.timestamp = data.get().createdAt;
        socketComment.id = data.get().id;
        res.status(200).send("Comment submitted");
        return userModel.findOne({
                  where: {id: data.get().userId}
                });
              })
                .then((user) => {
                  socketComment.name = user.name;
                  io.to(socketComment.stockId).emit('newComment', socketComment);
                })
                .catch((err) => {
                  debug(err);
                  res.status(400).send(err);
                });

});
  // Get comments by stockId
  router.get('/comments/:id', passport.authenticate('jwt', { session: false }),
    function(req, res){
      commentModel.findAll({
          where: {stockId: req.params.id},
          include: [{
            model: userModel,
            attributes:['name','id'],
        }],
        order:[['createdAt','ASC']]
      })
        .then((comments) => {
          res.status(200).send(comments);
        })
        .catch((err) => {
          debug(err);
          res.status(400).send(err);
        });
  });
  // delete comments by commentId
  router.delete('/comments/delete/:id', passport.authenticate('jwt', { session: false }),
    function(req, res) {
      commentModel.findOne({
        where: {id: req.params.id}
      })
      .then((comment) => {
        io.to(comment.stockId).emit('deleteComment', comment);
        comment.destroy();
        res.status(200).send("Comment deleted");
      })
      .catch((err) => {
        res.send(400).send(err);
      });
    });
    return router;
  };
