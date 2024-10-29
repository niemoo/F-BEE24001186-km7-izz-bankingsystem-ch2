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

      const result = await transactionService.getTransactionById(transaction.id);
      expect(result).toEqual(transaction);
    });

    it('should throw an error if transaction not found', async () => {
      const transactionId = 1;
      prisma.transaction.findUnique.mockResolvedValueOnce(null);

      const transactionService = new TransactionService();

      await expect(transactionService.getTransactionById(transactionId)).rejects.toThrow(`Transaction with ID: ${transactionId} not found.`);
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

      const amount = 100000;

      prisma.bank_account.findUnique.mockResolvedValueOnce(sourceAccount);
      prisma.bank_account.findUnique.mockResolvedValueOnce(destinationAccount);
      prisma.bank_account.update.mockResolvedValueOnce(sourceAccount);
      prisma.bank_account.update.mockResolvedValueOnce(destinationAccount);
      prisma.transaction.create.mockResolvedValueOnce({ id: 1, source_account_id: sourceAccount.id, destination_account_id: destinationAccount.id, amount });

      const transactionService = new TransactionService();

      const result = await transactionService.transferBalance(sourceAccount.id, destinationAccount.id, 100000);
      expect(result).toEqual({ id: 1, source_account_id: sourceAccount.id, destination_account_id: destinationAccount.id, amount });
    });

    it('should throw an error if source account not found', async () => {
      const sourceAccountId = 1;
      const destinationAccountId = 2;
      const amount = 100000;

      prisma.bank_account.findUnique.mockResolvedValueOnce(null);

      const transactionService = new TransactionService();

      await expect(transactionService.transferBalance(sourceAccountId, destinationAccountId, amount)).rejects.toThrow(`Source account with ID: ${sourceAccountId} not found.`);
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

      const destinationAccountId = 2;
      const amount = 100000;

      prisma.bank_account.findUnique.mockResolvedValueOnce(sourceAccount);
      prisma.bank_account.findUnique.mockResolvedValueOnce(null);

      const transactionService = new TransactionService();

      await expect(transactionService.transferBalance(sourceAccount.id, destinationAccountId, amount)).rejects.toThrow(`Destination account with ID: ${destinationAccountId} not found.`);
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

      const amount = 200000;

      prisma.bank_account.findUnique.mockResolvedValueOnce(sourceAccount);
      prisma.bank_account.findUnique.mockResolvedValueOnce(destinationAccount);

      const transactionService = new TransactionService();

      await expect(transactionService.transferBalance(sourceAccount.id, destinationAccount.id, amount)).rejects.toThrow('Insufficient balance.');
    });

    it('should throw an error if transfer failed', async () => {
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

      const amount = 100000;

      prisma.bank_account.findUnique.mockResolvedValueOnce(sourceAccount);
      prisma.bank_account.findUnique.mockResolvedValueOnce(destinationAccount);
      prisma.bank_account.update.mockResolvedValueOnce(sourceAccount);
      prisma.bank_account.update.mockResolvedValueOnce(destinationAccount);
      prisma.transaction.create.mockResolvedValueOnce(null);

      const transactionService = new TransactionService();

      await expect(transactionService.transferBalance(sourceAccount.id, destinationAccount.id, amount)).rejects.toThrow('Transfer balance failed.');
    });
  });
});
