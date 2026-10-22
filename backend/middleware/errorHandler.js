export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose / MongoDB CastError (invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID format: '${err.value}'. Must be a valid 24-character hexadecimal string.`;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join(', ');
  }

  // Handle MongoDB duplicate key errors (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered.';
  }

  // Sanitize message to never expose MongoDB connection strings or passwords
  if (message.includes('mongodb://') || message.includes('mongodb+srv://')) {
    message = 'Database connection error. Please verify database configuration.';
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: `Not Found - Endpoint '${req.originalUrl}' does not exist on this server.`
  });
};
