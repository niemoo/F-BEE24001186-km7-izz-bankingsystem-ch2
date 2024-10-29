import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { TransactionController } from '../controllers/transactionController.js';
import { TransactionValidation } from '../middleware/validations/transactionController.js';

export default (app) => {
  const router = express.Router();
  app.use('/transactions', router);
  const transactionController = new TransactionController();

  router.get('/', authMiddleware, transactionController.getAllTransactions.bind(transactionController));

  router.get('/:id', authMiddleware, transactionController.getTransactionById.bind(transactionController));

  router.post('/', TransactionValidation.transferBalanceValidation, transactionController.transferBalance.bind(transactionController));
};
