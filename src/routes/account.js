const express = require('express');
const { AccountService } = require('../services/account');

module.exports = (app) => {
  const router = express.Router();

  const accountService = new AccountService();

  app.use('/v1/accounts', router);

  router.get('/balance/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const balance = await accountService.getCurrentBalance(id);

      const numericBalance = parseFloat(balance);

      console.log({ balance: numericBalance.toFixed(2) });

      res.status(200).json({ balance: numericBalance.toFixed(2) });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};
