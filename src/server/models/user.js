/* jslint node: true */
/*jshint esversion: 6 */

"use strict";

const db = require('../sequelize.js');

var bcrypt = require('bcrypt');

module.exports = function() {

  var User = db.sequelize.define('users', {
   id: {
     type: db.Sequelize.INTEGER,
     primaryKey: true,
     autoIncrement: true
   },
   email: {
     type: db.Sequelize.STRING
   },
   password: {
     type: db.Sequelize.STRING
   },
   name: {
     type: db.Sequelize.STRING
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
  return User;
};
