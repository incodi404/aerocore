export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string, stack?: string) {
    super(message);
    this.statusCode = statusCode;

    // maintain correct prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);

    if (stack) {
      this.stack = stack; // passed the actual stack
    } else {
      // capture stack explicitly
      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
}
