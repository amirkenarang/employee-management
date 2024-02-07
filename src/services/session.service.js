
const httpStatus = require('http-status');
const { Session } = require('../models');

const insertSession = async (
  userId,
  email,
  refreshToken,
) => {
  const session = await Session.create({
    userId,
    email,
    status: "ACTIVE",
    refreshToken,
  });
  return session
}

const refreshToken = async (refreshToken) => {
  const session = await Session.findOneAndUpdate(
    {
      refreshToken,
      status: "ACTIVE",
    },
    {
      refreshAt: new Date(),
    },
  ).lean();
  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, 'Session Not Found', 'session.service.js', 'refreshToken');
  }
  return session
}

module.exports = {
  insertSession,
  refreshToken
};
