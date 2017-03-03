/*jshint esversion: 6 */
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = function(passport){
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = 'secret';
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    module.parent.userModel.findOne({
      where: {email: jwt_payload.email, password: jwt_payload.password}
    }).then(function(user){
      if (user) {
        done(null, user.get());
      } else {
        done(null, false);
      }
    }).catch(function(err){
      return done(err,null);
    });
  }));
};
