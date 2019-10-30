const passport = require('passport');

const handleJWT = (
  request,
  response,
  next,
  roles
) => async (err, data, info) => {
  const error = err || info;
  const { user } = data;

  if (roles.length) {
    const isAllowed = roles.some(role => user.roles.includes(role));

    if (!isAllowed) return response.status(403).send({ error: 'User not included on authorized role' });

    return next();
  }

  return next();
};

module.exports = (roles = []) => (request, response, next) =>
  passport.authenticate(
    'jwt',
    { session: false },
    handleJWT(request, response, next, roles)
  )(request, response, next);
