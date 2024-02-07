const logger = require('../config/logger');
const { getNowDate } = require('../utils/timezoone');

const httpRequestLogger = async (req, res, next) => {
  const { rawHeaders, httpVersion, method, socket, url, body, params, query } = req;
  const { remoteAddress, remoteFamily } = socket;

  const request = {
    body,
    params,
    query,
    rawHeaders,
    httpVersion,
    method,
    remoteAddress,
    remoteFamily,
    url,
  };

  const oldWrite = res.write;
  const oldEnd = res.end;

  const chunks = [];

  res.write = function(chunk) {
    chunks.push(new Buffer(chunk));

    oldWrite.apply(res, arguments);
  };

  res.end = function(chunk) {
    if (chunk) chunks.push(new Buffer(chunk));
    const response = Buffer.concat(chunks).toString('utf8');

    if (request.body.hasOwnProperty('password')) {
      delete request.body.password;
    }

    const message = `${req.method}: ${req.originalUrl}`;
    const timestamp = getNowDate();
    const statusCode = res.statusCode;
    const data = { statusCode, message, request, response };
    const thread = 'App.js';
    const classes = 'httpLogger';
    const level = 'Info';

    const log = `${timestamp}|${level}|${thread}|${classes}|${JSON.stringify(data)}`;

    logger.info(log);

    oldEnd.apply(res, arguments);
  };

  next();
};

module.exports = {
  httpRequestLogger,
};
