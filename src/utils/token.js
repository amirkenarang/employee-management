const jwt = require('jsonwebtoken');

/**
 * @description decode token
 * @param {String} token
 */
const decodeToken = async token => {
  token = {
    encoded: token,
    decoded: jwt.decode(token),
  };
  return token;
};

/**
 * @description parse token and return email
 * @param {String} token
 */
const parseToken = async token => {
  return token.decoded.email
};

module.exports = {
  decodeToken,
  parseToken,
};
