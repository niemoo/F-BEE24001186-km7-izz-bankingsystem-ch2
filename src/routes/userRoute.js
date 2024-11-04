import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { upload, imageKit } from '../middleware/fileUploadMiddleware.js';

export default (app) => {
  const router = Router();
  app.use('/users', router);
  const userController = new UserController();

  router.get('/', userController.getAllUsers.bind(userController));

  router.get('/:id', userController.getUserById.bind(userController));
  router.post('/image', upload.single('image'), (req, res) => {
    const base64File = req.file.buffer.toString('base64');
    if (req.file) {
      imageKit.upload(
        {
          file: base64File,
          fileName: req.file?.originalname,
        },
        (err, response) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              message: err.message,
            });
          } else {
            const { url } = response;
            const modifiedUrl = imageKit.url({
              src: url,
              transformation: [
                {
                  quality: '100',
                  format: 'png',
                  overlayText: 'ImageKit',
                  overlayTextColor: 'purple',
                  focus: 'auto',
                },
              ],
            });

            res.json({ status: 'success', url: modifiedUrl, message: 'Successfully uploaded files' });
          }
        }
      );
    }
  });
};
