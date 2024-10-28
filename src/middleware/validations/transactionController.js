import Joi from 'joi';

export class TransactionValidation {
  static async transferBalanceValidation(req, res, next) {
    const schema = Joi.object({
      source_account_id: Joi.number().required(),
      destination_account_id: Joi.number().required(),
      amount: Joi.number().required(),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const message = error.details.map((err) => err.message);
      return res.status(400).json({ message });
    }

    next();
  }
}
