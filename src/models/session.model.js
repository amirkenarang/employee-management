const mongoose = require('mongoose');
const { pick } = require('lodash');
const { date } = require('@hapi/joi');
const { status } = require('../config/status');

const sessionSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    refreshAt: {
      type: Date,
      require: true
    },
    status: {
      type: String,
      required: true,
      enum: status,
      default: 'ACTIVE',
    }

  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  }
);

sessionSchema.methods.transform = function () {
  const session = this;
  return pick(session.toJSON(), ['id', 'email', 'userId']);
};

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
