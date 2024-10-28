import jwt from 'jsonwebtoken';

let JWT_SECRET = 'asddas';

const authMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: 'Unauthorized.',
    });
  }

  jwt.verify(req.headers.authorization, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: 'Unauthorized.',
      });
    }

    req.user = decoded;
    next();
  });
};

export default authMiddleware;
