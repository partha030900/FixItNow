class AppError extends Error {
  statusCode: number;
  errorDetails?: any;

  constructor(statusCode: number, message: string, errorDetails?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;