import { AuthService } from '../services/authService.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res, next) {
    try {
      const value = req.body;
      const data = await this.authService.login(value);

      res.status(200).json({
        data,
        message: 'Successfully login.',
      });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  }
}
