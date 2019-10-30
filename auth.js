const passport = require('passport');
const passportJWT = require('passport-jwt');
const { Strategy, ExtractJwt } = passportJWT;

const config = require('./infra/jwtconfig');
const users = require('./users');

module.exports = function() {
  const strategy = new Strategy(params, function(payload, done) {
    const user = Array.from(users).find(user => user.name === payload.name);

    if (user) {
      return done(null, { name: user.name });
    } else {
      return done(new Error("User not found"), null);
    }
  });

  passport.use('jwt', strategy);

  return {
    authenticate: function() {
      return passport.authenticate("jwt", config.jwtSession);
    }
  };
};
