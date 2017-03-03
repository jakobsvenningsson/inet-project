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

router.post('/login',
 function(req, res){
  userModel.findOne({
    where: { email: req.body.email}
  }).then(function(user){
    console.log(user);
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
      console.log(err);
      res.status(401).send(err);
    });

  }).catch(function(err){
    console.log(err);
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
      console.log(err);
      res.status(400).send(err);
    });
});

router.get('/test',module.parent.passport.authenticate('jwt', { session: false }), function(req,res){
  console.log(req.user.email + " has logged in!");
});


router.get('/stocks/external/search/:id',
  function(req, res){
  console.log("INSIDE");
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
      console.log(str);
      res.status(200).send(str);
    });
  });
});

router.get('/stocks',function(req, res){
  stockModel.findAll()
    .then(function(data){
      res.status(200).send(data);

    }).catch(function(err){
      console.log(err);
      res.status(400).send(err);
    });
});

router.get('/stocks/:id',function(req, res){
  stockModel.findOne({
    where: {id:req.params.id}
  })
    .then(function(row){
      res.status(200).send(row);

    }).catch(function(err){
      console.log(err);
      res.status(400).send(err);
    });
});

router.post('/stocks/submit', function(req, res){
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
    console.log(err);
    res.status(400).send(err);
  });
});

router.post('/comments/submit', function(req, res){
  commentModel.create(req.body)
    .then(function(data){
      io.to(data.stock).emit('newComment', data);
      res.status(200).send("Comment submitted");
    })
    .catch(function(err){
      console.log(err);
      res.status(400).send(err);
    });
});

router.get('/comments/:id', function(req, res){
  commentModel.findAll({
    where:{stock:req.params.id}
  })
    .then(function(comments){
      res.status(200).send(comments);
    })
    .catch(function(err){
      console.log(err);
      res.status(400).send(err);
    });
});


module.exports = router;
