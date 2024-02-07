const Joi = require('@hapi/joi');
const { password } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .custom(password),
    name: Joi.string().required(),
    role: Joi.string()
      .required()
      .valid('user', 'admin')
      .required(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    email: Joi.string(),
    id: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    id: Joi.required().required(),
  }),
};


const updateUser = {
  params: Joi.object().keys({
    id: Joi.required().required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string(),
      role: Joi.string()
        .valid('user', 'admin')
        .required(),
    })
    .min(1),
};

const updatePassword = {
  params: Joi.object().keys({
    id: Joi.required().required(),
  }),
  body: Joi.object()
    .keys({
      currentPassword: Joi.string().required(),
      password: Joi.string()
        .custom(password)
        .required(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    id: Joi.required().required(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updatePassword,
  deleteUser,
};
