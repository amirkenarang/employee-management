const winston = require('winston');
const config = require('./config');
const { getNowDate } = require('../utils/timezoone');

const enumerateErrorFormat = winston.format(info => {
  if (info instanceof Error) {
    const message = info.stack;
    const timestamp = getNowDate();
    const statusCode = info.statusCode;
    const data = { statusCode, message };
    const thread = info.thread;
    const className = info.className;
    const level = 'Error';

    const log = `${timestamp}|${level}|${thread}|${className}|${JSON.stringify(data)}`;

    Object.assign(info, { message: log });
  }
  return info;
});

const consoleTransport = new winston.transports.Console({
  stderrLevels: ['error'],
});

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${message}`)
  ),
  transports: [consoleTransport, new winston.transports.File({ filename: config.logs.fileName })],
});

module.exports = logger;
