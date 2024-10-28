import express from 'express';
import { AuthController } from '../controllers/authController.js';

export default (app) => {
  const router = express.Router();
  app.use('/auth', router);
  const authController = new AuthController();

  router.post('/login', authController.login.bind(authController));
};
