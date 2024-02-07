const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user.transform());
});

const getUsers = catchAsync(async (req, res) => {
  const { users, count } = await userService.getUsers(req.query);
  const response = users.map(user => user.transform());
  const result = {
    result: response,
    count,
  };
  res.send(result);
});


const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.send(user.transform());
});


const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.send(user.transform());
});


const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const updatePassword = catchAsync(async (req, res) => {
  const response = await userService.updatePassword(req.user.id, req.params.id, req.body);
  res.send(response);
});



module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updatePassword,
  deleteUser,
};
