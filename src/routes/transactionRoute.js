const express = require('express');
const { TransactionController } = require('../controllers/transactionController.js');

module.exports = (app) => {
  const router = express.Router();

  const transactionController = new TransactionController();

  app.use('/api/v1/transactions', router);

  router.get('/', transactionController.getAllTransactions.bind(transactionController));

  router.get('/:transactionId', transactionController.getTransactionById.bind(transactionController));

  router.post('/', transactionController.transferBalance.bind(transactionController));
};
