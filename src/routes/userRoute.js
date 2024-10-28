import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { UserValidation } from '../middleware/validations/userValidation.js';

export default (app) => {
  const router = Router();
  app.use('/users', router);
  const userController = new UserController();

  router.get('/', userController.getAllUsers.bind(userController));

  router.get('/:userId', userController.getUserById.bind(userController));

  router.post('/', UserValidation.addUserValidation, userController.addUser.bind(userController));
};
