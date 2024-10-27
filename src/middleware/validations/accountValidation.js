import Joi from 'joi';

export class AccountValidation {
  static async addAccountValidation(req, res, next) {
    const schema = Joi.object({
      user_id: Joi.number().required(),
      bank_name: Joi.string().required(),
      bank_account_number: Joi.string().required(),
      balance: Joi.number().required(),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const message = error.details.map((err) => err.message);
      return res.status(400).json({ message });
    }

    next();
  }
}
