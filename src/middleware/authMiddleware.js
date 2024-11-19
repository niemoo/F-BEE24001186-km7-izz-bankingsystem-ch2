import jwt from 'jsonwebtoken';

let JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized.',
      });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: 'Invalid token.',
        });
      }
      req.user = decoded;

      next();
    });
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;
