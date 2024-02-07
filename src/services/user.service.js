const httpStatus = require('http-status');
const { pick } = require('lodash');
const { getQueryOptions } = require('../utils/service.util');
const AppError = require('../utils/AppError');
const { User } = require('../models');
const { roles } = require('../config/roles');
const tokenService = require('./token.service');

/**
 * @description Check dupplication of email
 * @param {String} email
 */
const checkDuplicateEmail = async (email) => {
  const user = await User.findOne({ email });
  if (user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Email already taken',
      'user.service.js',
      'checkDuplicateEmail'
    );
  }
};


/**
 * @description Create User - This Method check user exist in IAM. If user not exist then create user in IAM. Fially Add User in Database
 * @param {Object} userBody
 */
const createUser = async (userBody) => {
  const { password, email } = userBody;
  await checkDuplicateEmail(email);
  const hashedPassword = await tokenService.hashPassword(password)
  const user = await User.create({ ...userBody, hashedPassword });
  return user;
};

const getUsers = async query => {
  const filter = pick(query, ['name', 'role', 'username', 'email', '_id']);
  const options = getQueryOptions(query);

  const count = await User.find(filter).countDocuments(filter);
  const users = await User.find(filter, null, options);
  return { users, count };
};

/**
 * @description Get an user wih ID
 * @param {string} userId
 */
const getUserById = async userId => {
  const user = await User.findById(userId)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found', 'user.service.js', 'getUserById');
  }
  return user;
};

/**
 * @description Get an user wih email
 * @param {string} email
 */
const getUserByEmail = async email => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'No user found with this email', 'user.service.js', 'getUserByUsername');
  }
  return user;
};


/**
 * @description Update User
 * This Method Check User is Exist, then check Duplication email, Finally Update it in database
 * @param {String} paramUsername
 * @param {Object} updateBody
 */
const updateUser = async (userId, updateBody) => {
  const { email, name } = updateBody;
  const existingUser = await getUserById(userId);
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'No user found with this email', 'user.service.js', 'getUserByUsername');
  }
  if (email) {
    await checkDuplicateEmail(email, existingUser.id);
  }
  Object.assign(existingUser, updateBody);
  await existingUser.save();
  return existingUser;
};


/**
 * @description Remove user from database
 * @param {String} username
 */
const deleteUser = async id => {
  const user = await getUserById(id);
  if (user.email) {
    await User.deleteOne({ _id: id })
    return { response: 'User Deleted' };;
  }
};

/**
 * @description Update Password
 * @param {String} userId
 * @param {Object} body
 */
const updatePassword = async (id, userId, body) => {
  const user = await getUserById(id)
  const isPasswordValid = await tokenService.comparePassword(body.currentPassword, user.hashedPassword)
  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password is Incorrect', 'user.service.js', 'updatePassword');
  }

  const hashedPassword = await tokenService.hashPassword(body.password)
  await User.updateOne({ _id: id }, { hashedPassword });

  return { response: 'Password Updated' };
};


module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  updatePassword,
};
