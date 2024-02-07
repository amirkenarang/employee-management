const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService } = require('../services');

const login = catchAsync(async (req, res) => {
  const response = await authService.loginUser(req.body.email, req.body.password);
  res.status(httpStatus.OK).send(response);
});

const refreshTokens = catchAsync(async (req, res) => {
  const response = await authService.refreshAuthTokens(req.body.refreshToken);
  res.status(httpStatus.OK).send(response);
});

module.exports = {
  login,
  refreshTokens,
};
