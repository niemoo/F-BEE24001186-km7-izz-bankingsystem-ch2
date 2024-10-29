import { UserService } from '../services/userService.js';

export class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req, res, next) {
    try {
      const data = await UserService.getAllUsers();

      res.status(200).json({ data, message: 'Successfully get all users data.' });
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await UserService.getUserById(id);

      res.status(200).json({ data, message: `Successfully get user data by ID: ${id}.` });
    } catch (err) {
      next(err);
    }
  }
}
