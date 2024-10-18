const joi = require('joi');
const { UserService } = require('../services/userService');

const schema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  identity_type: joi.string().required(),
  identity_number: joi.string().required(),
  address: joi.string().required(),
});

class UserController {
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
      const { value, error } = schema.validate(req.body);

      if (error) {
        error.isJoi = true;
        return next(error);
      }

      const { name, email, password, identity_type, identity_number, address } = value;

      const newUser = new UserService(name, email, password, identity_type, identity_number, address);

      const data = await newUser.addUser();

      res.status(201).json({ data, message: 'Successfully created a new user.' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = { UserController };
