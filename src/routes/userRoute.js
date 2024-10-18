const express = require('express');
const { UserController } = require('../controllers/userController');

module.exports = (app) => {
  const router = express.Router();

  const userController = new UserController();

  app.use('/api/v1/users', router);

  router.get('/', userController.getAllUsers.bind(userController));

  router.get('/:userId', userController.getUserById.bind(userController));

  router.post('/', userController.addUser.bind(userController));
};
