/*jshint esversion: 6 */

const express = require('express');
const jwt = require('jsonwebtoken');
const http = require('http');
const router = express.Router();

var db = module.parent.db;
var userModel = module.parent.userModel;
var stockModel = module.parent.stockModel;
var commentModel = module.parent.commentModel;
var io = module.parent.io;
var debug = module.parent.debug;




router.post('/comments/submit', module.parent.passport.authenticate('jwt', { session: false }), function(req, res){
  commentModel.create(req.body)
    .then(function(data){
      io.to(data.stock).emit('newComment', data);
      res.status(200).send("Comment submitted");
    })
    .catch(function(err){
      debug(err);
      res.status(400).send(err);
    });
});

router.get('/comments/:id',module.parent.passport.authenticate('jwt', { session: false }),  function(req, res){
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


module.exports = router;
