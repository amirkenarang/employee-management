class AppError extends Error {
  constructor(statusCode, message, thread = 'AppError.js', className = 'AppError', isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.thread = thread;
    this.className = className;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = AppError;
