function errorHandler(err, req, res, next) {
  console.log(err.stack);
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
  });
}

export default errorHandler;
