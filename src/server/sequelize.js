/* jslint node: true */
/*jshint esversion: 6 */
//mysql --host=mysql-vt2016.csc.kth.se --user=jaksve_admin --password=o3qrVJkh
"use strict";

var Sequelize = require('sequelize');
var debug = require('debug')('debug');
var sequelize = new Sequelize('jaksve', 'jaksve_admin', 'o3qrVJkh', {
  host: 'mysql-vt2016.csc.kth.se',
  logging: true,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

sequelize.authenticate()
         .then(function(err){
           debug('Conected to database!');
         },function(err){
           debug(err);
         });

module.exports = {
  sequelize:sequelize,
  Sequelize:Sequelize
};
