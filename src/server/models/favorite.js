/* jslint node: true */
/*jshint esversion: 6 */
"use strict";

const db = require('../sequelize.js');

module.exports = function() {

  var Favorite = db.sequelize.define('comments', {
   user: {
     type: db.Sequelize.STRING
   },
   stock: {
     type: db.Sequelize.STRING
   }
  },{
    timestamps: false
});
  return Favorite;
};
