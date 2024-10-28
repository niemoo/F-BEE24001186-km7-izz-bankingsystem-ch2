import { TransactionService } from '../services/transactionService.js';

export class TransactionController {
  constructor() {
    this.transactionService = new TransactionService();
  }

  async getAllTransactions(req, res, next) {
    try {
      const data = await this.transactionService.getAllTransactions();

      res.status(200).json({ data, message: 'Successfully get all transactions data.' });
    } catch (err) {
      next(err);
    }
  }

  async getTransactionById(req, res, next) {
    try {
      const { transactionId } = req.params;
      const transaction = await this.transactionService.getTransactionById(transactionId);

      const responseData = {
        id: transaction.id,
        amount: transaction.amount,
        sender: {
          account_id: transaction.sourceAccount.id,
          name: transaction.sourceAccount.user.name,
          bank_name: transaction.sourceAccount.bank_name,
        },
        receiver: {
          account_id: transaction.destinationAccount.id,
          name: transaction.destinationAccount.user.name,
          bank_name: transaction.destinationAccount.bank_name,
        },
      };

      res.status(200).json({
        data: responseData,
        message: `Successfully get transaction data by ID: ${transactionId}.`,
      });
    } catch (err) {
      next(err);
    }
  }

  async transferBalance(req, res, next) {
    try {
      const { source_account_id, destination_account_id, amount } = req.body;

      const transaction = new TransactionService();
      const data = await transaction.transferBalance(source_account_id, destination_account_id, amount);

      res.status(200).json({ data, message: 'Successfully transfer balance.' });
    } catch (err) {
      next(err);
    }
  }
}
