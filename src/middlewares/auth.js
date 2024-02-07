const httpStatus = require('http-status');
const AppError = require('../utils/AppError');
const { roleRights } = require('../config/roles');
const { decodeToken, parseToken } = require('../utils/token');
const { User } = require('../models');

const checkUser = async tokenArray => {
  const token = await decodeToken(tokenArray[1]);
  const email = await parseToken(token);

  const user = await User.findOne({ email });
  return user;
};

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, res, info) => {
  if (!req.headers.authorization) {
    return reject(new AppError(httpStatus.UNAUTHORIZED, 'Please authenticate', 'auth.js', 'verifyCallback'));
  }
  const tokenArray = req.headers.authorization.split(' ');

  const user = await checkUser(tokenArray);
  if (!user) {
    return reject(new AppError(httpStatus.BAD_REQUEST, 'No user found with this email', 'auth.js', 'verifyCallback'));
  }

  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every(requiredRight => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new AppError(httpStatus.FORBIDDEN, 'Forbidden', 'auth.js', 'verifyCallback'));
    }
  }

  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    verifyCallback(req, resolve, reject, requiredRights)(req, res, next);
  })
    .then(() => next())
    .catch(err => next(err));
};

module.exports = auth;
