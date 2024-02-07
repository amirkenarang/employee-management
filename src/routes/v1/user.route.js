const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(auth('manageUsers'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:id')
  .get(auth('manageUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);


router
  .route('/password/:id')
  .patch(auth('manageUsers'), validate(userValidation.updatePassword), userController.updatePassword);


module.exports = router;
