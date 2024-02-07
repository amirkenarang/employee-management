const httpStatus = require('http-status');
const userService = require('./user.service');
const tokenService = require('./token.service');
const sessionService = require('./session.service');
const AppError = require('../utils/AppError');

const loginUser = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User does not exists', 'auth.service.js', 'loginUser');
  }

  const isPasswordValid = await tokenService.comparePassword(password, user.hashedPassword)
  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password is Incorrect', 'auth.service.js', 'loginUser');
  }

  const userId = user._id.toString();
  const userRole = user.role;

  let refreshPayload = {
    userId: userId,
    role: userRole,
    email: user.email,
  }
  const refresh_token = await tokenService.signToken(refreshPayload);
  const session = await sessionService.insertSession(
    userId,
    email,
    refresh_token,
  );

  let payload = {
    userId: userId,
    role: userRole,
    email: user.email,
    sessionId: session._id.toString(),
  }
  const access_token = await tokenService.signToken(payload);

  const response = {};
  response.access_token = access_token;
  response.refresh_token = refresh_token;
  response.user = user;

  return response;

};

const refreshAuthTokens = async refreshToken => {
  try {
    const session = await sessionService.refreshToken(refreshToken);

    const user = await userService.getUserByEmail(session.email);
    let payload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
      sessionId: session._id.toString(),
    }
    const access_token = await tokenService.signToken(payload);

    const response = {};
    response.access_token = access_token;
    response.refresh_token = refreshToken;
    response.user = user;

    return response;

  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Please authenticate', 'auth.service.js', 'refreshAuthTokens');
  }
};

module.exports = {
  loginUser,
  refreshAuthTokens,
};
