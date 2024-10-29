import express from 'express';
import { AccountController } from '../controllers/accountController.js';
import { AccountValidation } from '../middleware/validations/accountValidation.js';
import authMiddleware from '../middleware/authMiddleware.js';

export default (app) => {
  const router = express.Router();
  app.use('/accounts', router);
  const accountController = new AccountController();

  router.get('/', authMiddleware, accountController.getAllAccounts.bind(accountController));

  router.get('/:id', authMiddleware, accountController.getAccountById.bind(accountController));

  router.get('/:id/balance', accountController.getCurrentBalanceById.bind(accountController));

  router.post('/', AccountValidation.addAccountValidation, accountController.addAccount.bind(accountController));

  router.put('/:id/deposit', accountController.depositBalance.bind(accountController));

  router.put('/:id/withdraw', accountController.withdrawBalance.bind(accountController));
};
