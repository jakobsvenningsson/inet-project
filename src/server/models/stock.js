/* jslint node: true */
/*jshint esversion: 6 */

"use strict";

const db = require('../sequelize.js');

module.exports = function() {

  var Stock = db.sequelize.define('stocks', {
   id: {
     type: db.Sequelize.INTEGER,
     primaryKey: true,
     autoIncrement: true
   },
   name: {
     type: db.Sequelize.STRING
   },
   symbol: {
     type: db.Sequelize.STRING
   },
   exchange: {
     type: db.Sequelize.STRING
   }
  },{
    timestamps: false
});
  return Stock;
};
