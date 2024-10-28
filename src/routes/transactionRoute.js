import express from 'express';
import { TransactionController } from '../controllers/transactionController.js';
import { TransactionValidation } from '../middleware/validations/transactionController.js';

export default (app) => {
  const router = express.Router();
  app.use('/transactions', router);
  const transactionController = new TransactionController();

  router.get('/', transactionController.getAllTransactions.bind(transactionController));

  router.get('/:transactionId', transactionController.getTransactionById.bind(transactionController));

  router.post('/', TransactionValidation.transferBalanceValidation, transactionController.transferBalance.bind(transactionController));
};
