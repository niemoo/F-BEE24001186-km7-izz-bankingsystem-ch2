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
      const { userId } = req.params;
      const data = await UserService.getUserById(userId);

      res.status(200).json({ data, message: `Successfully get user data by ID: ${userId}.` });
    } catch (err) {
      next(err);
    }
  }

  async addUser(req, res, next) {
    try {
      const value = req.body;

      const newUser = new UserService();

      const data = await newUser.addUser(value);

      res.status(201).json({ data, message: 'Successfully created a new user.' });
    } catch (err) {
      next(err);
    }
  }
}
