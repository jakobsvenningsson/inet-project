/* jslint node: true */
/*jshint esversion: 6 */
"use strict";

const db = require('../sequelize.js');

module.exports = function() {

  var Com = db.sequelize.define('comments', {
   id: {
     type: db.Sequelize.INTEGER,
     primaryKey: true,
     autoIncrement: true
   },
   userId: {
     type: db.Sequelize.STRING
   },
   content: {
     type: db.Sequelize.STRING
   },
   stockId: {
     type: db.Sequelize.STRING
   }
  },{
    timestamps: true
});
  return Com;
};
