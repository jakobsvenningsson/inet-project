var Sequelize = require('sequelize');
var debug = require('debug')('debug');
//mysql --host=mysql-vt2016.csc.kth.se --user=jaksve_admin --password=o3qrVJkh
var sequelize = new Sequelize('jaksve', 'jaksve_admin', 'o3qrVJkh', {
  host: 'mysql-vt2016.csc.kth.se',
  logging: false,
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
