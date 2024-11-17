import { Notification } from '../libs/socket.js';
import { AuthService } from '../services/authService.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async register(req, res, next) {
    try {
      const value = req.body;

      const newUser = new AuthService();
      await Notification.push(`New user with email : ${value.email} is registered.`);

      const data = await newUser.register(value);

      res.status(201).json({ data, message: 'Successfully created a new user.' });
    } catch (err) {
      next(err);
    }
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
      next(err);
    }
  }
}
