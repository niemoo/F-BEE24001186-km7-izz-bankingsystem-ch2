import Joi from 'joi';

export class UserValidation {
  static async addUserValidation(req, res, next) {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      identity_type: Joi.string().required(),
      identity_number: Joi.string().required(),
      address: Joi.string().required(),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const message = error.details.map((err) => err.message);
      return res.status(400).json({ message });
    }

    next();
  }
}
