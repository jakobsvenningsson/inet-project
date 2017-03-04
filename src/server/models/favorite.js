/* jslint node: true */
/*jshint esversion: 6 */
"use strict";

const db = require('../sequelize.js');

module.exports = function() {

  var Favorite = db.sequelize.define('favorites', {
   userId: {
     type: db.Sequelize.STRING,
     primaryKey: true
   },
   stockId: {
     type: db.Sequelize.STRING,
     primaryKey: true
   }
  },{
    timestamps: false
});
  return Favorite;
};
