const mongoose = require('mongoose');
const { pick } = require('lodash');
const validator = require('validator');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: roles,
      default: 'user',
    },
    hashedPassword: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  }
);

userSchema.methods.transform = function () {
  const user = this;
  return pick(user.toJSON(), ['id', 'email', 'name', 'role']);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
