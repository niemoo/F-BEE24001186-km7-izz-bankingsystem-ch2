import { TransactionService } from '../transactionService';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    bank_account: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

describe('Transaction Service', () => {
  let prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
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

      const transactionService = new TransactionService();

      const result = await transactionService.getAllTransactions();
      expect(result).toEqual(transactions);
    });

    it('should throw an error if no transactions found', async () => {
      prisma.transaction.findMany.mockResolvedValueOnce([]);

      const transactionService = new TransactionService();

      await expect(transactionService.getAllTransactions()).rejects.toThrow('Transactions not found.');
    });
  });

  describe('get transaction by ID', () => {
    it('should return a transaction by ID', async () => {
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

      const transactionService = new TransactionService();

      const result = await transactionService.getTransactionById(1);
      expect(result).toEqual(transaction);
    });

    it('should throw an error if transaction not found', async () => {
      prisma.transaction.findUnique.mockResolvedValueOnce(null);

      const transactionService = new TransactionService();

      await expect(transactionService.getTransactionById(1)).rejects.toThrow('Transaction with ID: 1 not found.');
    });
  });

  describe('transfer balance', () => {
    it('should transfer balance between accounts and create new transfer', async () => {
      const sourceAccount = {
        id: 1,
        user_id: 1,
        bank_name: 'Bank A',
        bank_account_number: '1234567890',
        balance: 1000000,
        created_at: '2024-10-27T09:11:25.866Z',
        updated_at: null,
        deleted_at: null,
      };

      const destinationAccount = {
        id: 2,
        user_id: 2,
        bank_name: 'Bank B',
        bank_account_number: '0987654321',
        balance: 2000000,
        created_at: '2024-10-27T09:11:27.868Z',
        updated_at: null,
        deleted_at: null,
      };

      prisma.bank_account.findUnique.mockResolvedValueOnce(sourceAccount);
      prisma.bank_account.findUnique.mockResolvedValueOnce(destinationAccount);
      prisma.bank_account.update.mockResolvedValueOnce(sourceAccount);
      prisma.bank_account.update.mockResolvedValueOnce(destinationAccount);
      prisma.transaction.create.mockResolvedValueOnce({ id: 1, source_account_id: 1, destination_account_id: 2, amount: 100000 });

      const transactionService = new TransactionService();

      const result = await transactionService.transferBalance(1, 2, 100000);
      expect(result).toEqual({ id: 1, source_account_id: 1, destination_account_id: 2, amount: 100000 });
    });

    it('should throw an error if source account not found', async () => {
      prisma.bank_account.findUnique.mockResolvedValueOnce(null);

      const transactionService = new TransactionService();

      await expect(transactionService.transferBalance(1, 2, 100000)).rejects.toThrow('Source account with ID: 1 not found.');
    });

    it('should throw an error if destination account not found', async () => {
      const sourceAccount = {
        id: 1,
        user_id: 1,
        bank_name: 'Bank A',
        bank_account_number: '1234567890',
        balance: 1000000,
        created_at: '2024-10-27T09:11:25.866Z',
        updated_at: null,
        deleted_at: null,
      };

      prisma.bank_account.findUnique.mockResolvedValueOnce(sourceAccount);
      prisma.bank_account.findUnique.mockResolvedValueOnce(null);

      const transactionService = new TransactionService();

      await expect(transactionService.transferBalance(1, 2, 100000)).rejects.toThrow('Destination account with ID: 2 not found.');
    });

    it('should throw an error if source account balance is insufficient', async () => {
      const sourceAccount = {
        id: 1,
        user_id: 1,
        bank_name: 'Bank A',
        bank_account_number: '1234567890',
        balance: 100000,
        created_at: '2024-10-27T09:11:25.866Z',
        updated_at: null,
        deleted_at: null,
      };

      const destinationAccount = {
        id: 2,
        user_id: 2,
        bank_name: 'Bank B',
        bank_account_number: '0987654321',
        balance: 2000000,
        created_at: '2024-10-27T09:11:27.868Z',
        updated_at: null,
        deleted_at: null,
      };

      prisma.bank_account.findUnique.mockResolvedValueOnce(sourceAccount);
      prisma.bank_account.findUnique.mockResolvedValueOnce(destinationAccount);

      const transactionService = new TransactionService();

      await expect(transactionService.transferBalance(1, 2, 200000)).rejects.toThrow('Insufficient balance.');
    });
  });
});
