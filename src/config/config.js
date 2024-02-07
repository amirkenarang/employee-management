const dotenv = require('dotenv');
const path = require('path');
const Joi = require('@hapi/joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(3000),
    MONGO_CONNECTION_URL: Joi.string(),
    LOG_FILES_NAME: Joi.string().default('logs.log'),
    JWT_SECRET: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const mongoose = {
  connectionUrl: envVars.MONGO_CONNECTION_URL,
  options: {
  },
};

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose,
  jwt: envVars.JWT_SECRET,
  logs: {
    fileName: envVars.LOG_FILES_NAME,
  },
};
