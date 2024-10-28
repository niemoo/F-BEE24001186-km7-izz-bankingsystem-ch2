import { TransactionController } from '../transactionController.js';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

describe('Transaction Controller', () => {
  let prisma;
  let transactionController;
  let req, res, next;

  beforeEach(() => {
    prisma = new PrismaClient();
    transactionController = new TransactionController();
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get all transactions', () => {
    it('should return all transactions', async () => {
      const transactions = [
        {
          id: 1,
          source_account_id: 1,
          destination_account_id: 2,
          amount: 100000,
          created_at: '2024-10-27T09:11:25.866Z',
          updated_at: null,
          deleted_at: null,
        },
        {
          id: 2,
          source_account_id: 2,
          destination_account_id: 1,
          amount: 200000,
          created_at: '2024-10-27T09:11:27.868Z',
          updated_at: null,
          deleted_at: null,
        },
      ];

      prisma.transaction.findMany.mockResolvedValueOnce(transactions);

      await transactionController.getAllTransactions(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: transactions,
        message: 'Successfully get all transactions data.',
      });
    });

    it('should throw an error if no transactions found', async () => {
      prisma.transaction.findMany.mockResolvedValueOnce([]);

      await transactionController.getAllTransactions(req, res, next);

      expect(next).toHaveBeenCalled(new Error('Transactions not found.'));
    });
  });

  describe('get transaction by ID', () => {
    it('should return transaction data by ID', async () => {
      const transaction = {
        id: 1,
        source_account_id: 1,
        destination_account_id: 2,
        amount: 100000,
        created_at: '2024-10-27T09:11:25.866Z',
        updated_at: null,
        deleted_at: null,
      };

      prisma.transaction.findUnique.mockResolvedValueOnce(transaction);

      req.params.transactionId = transaction.id;

      await transactionController.getTransactionById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: transaction,
        message: `Successfully get transaction data by ID: ${transaction.id}.`,
      });
    });

    it('should throw an error if transaction not found', async () => {
      const id = 1;
      prisma.transaction.findUnique.mockResolvedValueOnce(null);

      req.params.id = id;

      req.params.transactionId = 1;

      await transactionController.getTransactionById(req, res, next);

      expect(next).toHaveBeenCalled(new Error(`Transaction with ID: ${id} not found.`));
    });
  });
});
