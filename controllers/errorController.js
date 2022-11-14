// Global error handler
const globalErrorHandler = (err, req, res, next) => {
  console.log(err);
  Error.captureStackTrace(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = err.message || "Some error occured";
  err.errorType = err.errorType || "generic-error";

  // Default error response
  res.status(err.statusCode).json({
    status: err.status,
    errorType: err.errorType,
    message: err.message,
  });
};

export default globalErrorHandler;
