/* jslint node: true */
/*jshint esversion: 6 */

"use strict";

module.exports = function(sequelize, Sequelize) {

  var Stock = sequelize.define('stocks', {
   id: {
     type: Sequelize.INTEGER,
     primaryKey: true,
     autoIncrement: true
   },
   name: {
     type: Sequelize.STRING
   },
   symbol: {
     type: Sequelize.STRING
   },
   exchange: {
     type: Sequelize.STRING
   }
  },{
    timestamps: false
});
  return Stock;
};
