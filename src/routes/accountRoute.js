const express = require('express');
const { AccountController } = require('../controllers/accountController.js');

module.exports = (app) => {
  const router = express.Router();

  const accountController = new AccountController();

  app.use('/api/v1/accounts', router);

  router.get('/', accountController.getAllAccounts.bind(accountController));

  router.get('/:id', accountController.getAccountById.bind(accountController));

  router.get('/:id/balance', accountController.getCurrentBalanceById.bind(accountController));

  router.post('/', accountController.addAccount.bind(accountController));

  router.put('/:id/deposit', accountController.depositBalance.bind(accountController));

  router.put('/:id/withdraw', accountController.withdrawBalance.bind(accountController));
};
