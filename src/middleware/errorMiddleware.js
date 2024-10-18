const { ErrorResponse } = require('../response/errorResponse');

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ErrorResponse) {
    return res.status(err.status).json({
      error: err.message,
    });
  }

  if (err.isJoi) {
    return res.status(400).json({
      error: err.details[0].message,
    });
  }

  res.status(500).json({
    error: 'Internal Server Error.',
  });
};

module.exports = errorMiddleware;
