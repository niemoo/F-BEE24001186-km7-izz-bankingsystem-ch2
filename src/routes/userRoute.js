import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { upload } from '../middleware/fileUploadMiddleware.js';

export default (app) => {
  const router = Router();
  app.use('/users', router);
  const userController = new UserController();

  router.get('/', userController.getAllUsers.bind(userController));

  router.get('/:id', userController.getUserById.bind(userController));
  router.put('/:id/image', upload.single('image'), userController.addImageProfile.bind(userController));
};
