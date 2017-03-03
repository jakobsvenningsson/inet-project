/* jslint node: true */
/*jshint esversion: 6 */

"use strict";

var bcrypt = require('bcrypt');

module.exports = function(sequelize, Sequelize) {

  var User = sequelize.define('users', {
   id: {
     type: Sequelize.INTEGER,
     primaryKey: true,
     autoIncrement: true
   },
   email: {
     type: Sequelize.STRING
   },
   password: {
     type: Sequelize.STRING
   },
   name: {
     type: Sequelize.STRING
   }
  },{
    timestamps: false,
    classMethods: {
      generateHash: function(password,saltRounds) {
        return bcrypt.genSalt(saltRounds)
          .then(function(salt){
            console.log(salt);
            return bcrypt.hash(password, salt);
          }).catch(function(err){
            console.log(err);
          });
      },
      validatePassword: function(password, hash) {
        return bcrypt.compare(password, hash);
    }
  }
});



  /*User.generateHash = function(password, saltRounds){
    bcrypt.genSalt(saltRounds)
      .then(function(salt){
        console.log(salt);
        return bcrypt.hash(password, salt);
      })
      .then(function(hash){
        console.log(hash);
      return hash;
    });
  };

  User.validatePassword = function(password, hash){
    bcrypt.compare(password, hash).then(function(valid){
      return valid;
    });
  };*/


  return User;
};
