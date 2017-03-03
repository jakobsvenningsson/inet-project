/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const userModel = require('../models/user.js')();
const debug = require('debug')('debug');
const jwt = require('jsonwebtoken');

router.post('/login',
 function(req, res){
  userModel.findOne({
    where: { email: req.body.email}
  }).then(function(user){
    if(!user) {
      throw "Error: no user with email " + req.body.email + " exists!";
    }
    user = user.get();
    userModel.validatePassword(req.body.password, user.password).then(function(valid){
      if (valid){
        var token = jwt.sign(user, "secret", {
            expiresIn: 10080 // in seconds
          });
        res.json({ id:user.id, email: user.email, name: user.name, token: 'JWT ' + token });
      } else {
        throw "wrong password";
      }
    }).catch(function(err){
      debug(err);
      res.status(401).send(err);
    });

  }).catch(function(err){
    debug(err);
    res.status(401).send(err);
  });
});

router.post('/register',
  function(req, res, next){
  userModel.findOne({
      attributes:['email'],
      where: { email:req.body.email }
    }).then(function(user){
      if(!user){
        userModel.generateHash(req.body.password, 10)
        .then(function(hash){
            return userModel.create({
                email: req.body.email,
                name: req.body.name,
                password: hash
            });
          });
      } else {
        throw "Error: account with email " + req.body.email + " already exists!";
      }
    }).then(function(data){
      res.send( "Account created");
    }).catch(function(err){
      debug(err);
      res.status(400).send(err);
    });
});

module.exports = router;
