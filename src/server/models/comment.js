/* jslint node: true */
/*jshint esversion: 6 */

"use strict";

module.exports = function(sequelize, Sequelize) {

  var Com = sequelize.define('comments', {
   id: {
     type: Sequelize.INTEGER,
     primaryKey: true,
     autoIncrement: true
   },
   author: {
     type: Sequelize.STRING
   },
   content: {
     type: Sequelize.STRING
   },
   stock: {
     type: Sequelize.STRING
   }
  },{
    timestamps: true
});
  return Com;
};
