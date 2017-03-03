var Sequelize = require('sequelize');
//mysql --host=mysql-vt2016.csc.kth.se --user=jaksve_admin --password=o3qrVJkh
var sequelize = new Sequelize('jaksve', 'jaksve_admin', 'o3qrVJkh', {
  host: 'mysql-vt2016.csc.kth.se',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

sequelize.authenticate()
         .then(function(err){
           console.log('success');
         },function(err){
           console.log(err);
         });

module.exports = {
  sequelize:sequelize,
  Sequelize:Sequelize
};
