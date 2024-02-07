const { compare, genSalt, hash } = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

/**
 * @description Hash Password
 * @param {String} password
 */
const hashPassword = async (password) => {
  const salt = await genSalt();
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
}

const signToken = async (payload) => {

  const secret = config.jwt;
  const token = jwt.sign({
    sub: payload.userId,
    sid: payload.sessionId,
    role: payload.role,
    email: payload.email,
  }, secret, { expiresIn: '1800s' });
  return token
}

const comparePassword = async (password, hashedPassword) => {
  return await compare(password, hashedPassword);
}

module.exports = {
  hashPassword,
  signToken,
  comparePassword
};