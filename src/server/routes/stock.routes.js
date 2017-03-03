/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const stockModel = require('../models/stock.js')();
const passport = require('passport');
const debug = require('debug')('debug');
const jwt = require('jsonwebtoken');
const http = require('http');

router.get('/stocks/external/search/:id', passport.authenticate('jwt', { session: false }),
  function(req, res){
  const id = req.params.id;
  http.get({
    host:'d.yimg.com',
    path:'/aq/autoc?query=' + id + '&region=IN&lang=en-UK'
  }, (response)=>{
    var str = '';
    //another chunk of data has been recieved, so append it to `str`
    response.on('data', (chunk)=>{
      str += chunk;
    });
    //the whole response has been recieved, so we just print it out here
    response.on('end', ()=>{
      debug(str);
      res.status(200).send(str);
    });
  });
});

router.get('/stocks', passport.authenticate('jwt', { session: false }), function(req, res){
  stockModel.findAll()
    .then(function(data){
      res.status(200).send(data);

    }).catch(function(err){
      debug(err);
      res.status(400).send(err);
    });
});

router.get('/stocks/:id',passport.authenticate('jwt', { session: false }), function(req, res){
  stockModel.findOne({
    where: {id:req.params.id}
  })
    .then(function(row){
      res.status(200).send(row);

    }).catch(function(err){
      debug(err);
      res.status(400).send(err);
    });
});

router.post('/stocks/submit', passport.authenticate('jwt', { session: false }), function(req, res){
  stockModel.findOne({
    where:{name:req.body.name}
  }).then(function(row){
    if(row){
      res.status(200).send("stock added!(tihihihi)");
    } else {
      return stockModel.create(req.body);
    }
  })
  .then(function(data){
    res.status(200).send("Stock added to database");
  })
  .catch(function(err){
    debug(err);
    res.status(400).send(err);
  });
});

module.exports = router;
