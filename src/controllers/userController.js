import { UserService } from '../services/userService.js';
import { imageKit } from '../middleware/fileUploadMiddleware.js';

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

  async addImageProfile(req, res, next) {
    if (!req.file) {
      return res.status(400).json({
        status: 'failed',
        message: 'No file uploaded',
      });
    }

    try {
      const base64File = req.file.buffer.toString('base64');
      imageKit.upload(
        {
          file: base64File,
          fileName: req.file.originalname,
        },
        async (err, response) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              message: err.message,
            });
          }

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

          const { id } = req.params;
          const { title = 'Untitled', description = 'No description provided' } = req.body;

          try {
            await UserService.addImageProfile(id, modifiedUrl, title, description);
            return res.json({ status: 'success', url: modifiedUrl, message: 'Successfully upload image' });
          } catch (serviceError) {
            next(serviceError);
          }
        }
      );
    } catch (err) {
      next(err);
    }
  }
}
