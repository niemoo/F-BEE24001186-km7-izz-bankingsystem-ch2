import express from 'express';
import { AuthController } from '../controllers/authController.js';
import { UserValidation } from '../middleware/validations/authValidation.js';

export default (app) => {
  const router = express.Router();
  app.use('/auth', router);
  const authController = new AuthController();

  router.post('/register', UserValidation.addUserValidation, authController.register.bind(authController));
  router.post('/login', authController.login.bind(authController));
};
