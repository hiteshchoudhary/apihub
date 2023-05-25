/**
 * @description Common Error class to throw an error from anywhere.
 */
class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
