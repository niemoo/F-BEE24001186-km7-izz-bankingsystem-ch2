const express = require('express');
const joi = require('joi');
const { AccountService } = require('../services/account');

const schema = joi.object({
  user_id: joi.number().required(),
  bank_name: joi.string().required(),
  bank_account_number: joi.string().required(),
  balance: joi.number().required(),
});

module.exports = (app) => {
  const router = express.Router();

  const accountService = new AccountService();

  app.use('/v1/accounts', router);

  router.get('/', async (req, res) => {
    try {
      const data = await accountService.getAllAccounts();

      res.status(200).json({
        data,
        message: 'Successfully get all accounts',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/:accountId', async (req, res) => {
    try {
      const { accountId } = req.params;
      const data = await accountService.getAccountById(accountId);

      res.status(200).json({
        data,
        message: `Successfully get account by ID: ${accountId}`,
      });
    } catch (err) {
      console.error(err);
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  router.get('/balance/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const data = await accountService.getCurrentBalanceById(id);

      res.status(200).json({
        balance: data[0].balance,
        message: `Successfully get current balance by bank account with ID: ${id}`,
      });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const { value, error } = schema.validate(req.body);
      if (error) {
        next(error);
      }

      const newAccount = new AccountService(value.user_id, value.bank_name, value.bank_account_number, value.balance);

      const data = await newAccount.addAccount();

      res.status(201).json({
        data,
        message: 'Successfully created a new account',
      });
    } catch (err) {
      next(err);
    }
  });
};
