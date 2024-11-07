import { ErrorResponse } from '../response/errorResponse.js';

const errorMiddleware = (err, req, res, _next) => {
  if (err instanceof ErrorResponse) {
    return res.status(err.status).json({
      error: err.message,
    });
  }

  res.status(500).json({
    error: err.message || 'Internal Server Error.',
  });
};

export default errorMiddleware;
