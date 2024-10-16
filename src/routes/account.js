const express = require('express');
const { AccountService } = require('../services/account');

module.exports = (app) => {
  const router = express.Router();

  const accountService = new AccountService();

  app.use('/v1/accounts', router);

  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const balance = await accountService.getCurrentBalance(id);

      console.log({ balance });

      res.status(200).json({ balance });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};
