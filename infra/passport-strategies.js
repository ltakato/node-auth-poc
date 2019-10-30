const { Strategy, ExtractJwt } = require('passport-jwt');

const config = require('./jwtconfig');

const strategyOptions = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const strategyVerifyCallback = async (payload, done) => {
  try {
    const users = require('../users');
    const user = Array.from(users).find(user => user.name === payload.name);

    if (user) return done(undefined, { payload, user });

    return done(undefined, false);
  } catch (error) {
    return done(error, false);
  }
};

module.exports = {
  jwt: new Strategy(strategyOptions, strategyVerifyCallback)
};
