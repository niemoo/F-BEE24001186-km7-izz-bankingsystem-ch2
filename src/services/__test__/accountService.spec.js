import { AccountService } from '../accountService.js';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    bank_account: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

describe('Account Service', () => {
  let prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get all accounts', () => {
    it('should return all users', async () => {
      const accounts = [
        {
          id: 1,
          user_id: 1,
          bank_name: 'Bank A',
          bank_account_number: '1234567890',
          balance: 1000000,
          created_at: '2024-10-27T09:11:25.866Z',
          updated_at: null,
          deleted_at: null,
        },
        {
          id: 2,
          user_id: 2,
          bank_name: 'Bank B',
          bank_account_number: '0987654321',
          balance: 2000000,
          created_at: '2024-10-27T09:11:27.868Z',
          updated_at: null,
          deleted_at: null,
        },
      ];

      prisma.bank_account.findMany.mockResolvedValueOnce(accounts);

      const accountService = new AccountService();

      const result = await accountService.getAllAccounts();
      expect(result).toEqual(accounts);
    });

    it('should throw an error if no accounts found', async () => {
      prisma.bank_account.findMany.mockResolvedValueOnce([]);

      const accountService = new AccountService();

      await expect(accountService.getAllAccounts()).rejects.toThrow('Accounts not found.');
    });
  });

  describe('get account data by ID', () => {
    it('should return account data by ID', async () => {
      const account = {
        id: 1,
        user_id: 1,
        bank_name: 'Bank A',
        bank_account_number: '1234567890',
        balance: 1000000,
        created_at: '2024-10-27T09:11:25.866Z',
        updated_at: null,
        deleted_at: null,
        user: {
          name: 'Mulyono',
        },
      };

      prisma.bank_account.findUnique.mockResolvedValueOnce(account);

      const accountService = new AccountService();

      const result = await accountService.getAccountById(account.id);
      expect(result).toEqual(account);
    });

    it('should throw an error if account not found', async () => {
      const id = 1;

      prisma.bank_account.findUnique.mockResolvedValueOnce(null);

      const accountService = new AccountService();

      await expect(accountService.getAccountById(id)).rejects.toThrow(`Account with ID: ${id} not found.`);
    });
  });

  describe('get current balance by ID', () => {
    it('should return current balance by ID', async () => {
      const id = 1;
      const balance = [
        {
          balance: 1000000,
        },
      ];

      prisma.bank_account.findMany.mockResolvedValueOnce(balance);

      const accountService = new AccountService();

      const result = await accountService.getCurrentBalanceById(id);
      expect(result).toEqual(balance);
    });

    it('should throw an error if account not found', async () => {
      const id = 1;

      prisma.bank_account.findMany.mockResolvedValueOnce([]);

      const accountService = new AccountService();

      await expect(accountService.getCurrentBalanceById(id)).rejects.toThrow(`Account with ID: ${id} not found.`);
    });
  });

  describe('add new account', () => {
    it('should add new account', async () => {
      const account = {
        user_id: 1,
        bank_name: 'Bank A',
        bank_account_number: '1234567890',
        balance: 1000000,
      };

      prisma.bank_account.create.mockResolvedValueOnce(account);

      const accountService = new AccountService();

      const result = await accountService.addAccount(account);
      expect(result).toEqual(account);
    });

    it('should throw an error if account creation fails', async () => {
      const account = {
        user_id: 1,
        bank_name: 'Bank A',
        bank_account_number: '1234567890',
        balance: 1000000,
      };

      prisma.bank_account.create.mockResolvedValueOnce(null);

      const accountService = new AccountService();

      await expect(accountService.addAccount(account)).rejects.toThrow('Bank account creation failed.');
    });
  });

  describe('deposit balance to account', () => {
    it('should deposit balance to account', async () => {
      const id = 1;
      const initialBalance = 1000000;
      const depositAmount = 500000;
      const expectedBalance = 1500000;

      prisma.bank_account.findUnique.mockResolvedValueOnce({ id, balance: initialBalance });
      prisma.bank_account.update.mockResolvedValueOnce({ id, balance: expectedBalance });

      const accountService = new AccountService();
      const result = await accountService.deposit(id, depositAmount);

      expect(result).toEqual({ id, balance: expectedBalance });
    });

    it('should throw an error if account not found', async () => {
      const id = 1;
      const depositAmount = 500000;

      prisma.bank_account.findUnique.mockResolvedValueOnce(null);

      const accountService = new AccountService();

      await expect(accountService.deposit(id, depositAmount)).rejects.toThrow(`Account with ID: ${id} not found.`);
    });

    it('should throw an error if deposit failed', async () => {
      const id = 1;
      const initialBalance = 1000000;
      const depositAmount = 500000;

      prisma.bank_account.findUnique.mockResolvedValueOnce({ id, balance: initialBalance });
      prisma.bank_account.update.mockResolvedValueOnce(null);

      const accountService = new AccountService();

      await expect(accountService.deposit(id, depositAmount)).rejects.toThrow('Failed to deposit to an account.');
    });
  });

  describe('withdraw balance from account', () => {
    it('should withdraw balance from account', async () => {
      const id = 1;
      const initialBalance = 1000000;
      const withdrawAmount = 500000;
      const expectedBalance = 500000;

      prisma.bank_account.findUnique.mockResolvedValueOnce({ id, balance: initialBalance });
      prisma.bank_account.update.mockResolvedValueOnce({ id, balance: expectedBalance });

      const accountService = new AccountService();
      const result = await accountService.withdraw(id, withdrawAmount);

      expect(result).toEqual({ id, balance: expectedBalance });
    });

    it('should throw an error if account not found', async () => {
      const id = 1;
      const withdrawAmount = 500000;

      prisma.bank_account.findUnique.mockResolvedValueOnce(null);

      const accountService = new AccountService();

      await expect(accountService.withdraw(id, withdrawAmount)).rejects.toThrow(`Account with ID: ${id} not found.`);
    });

    it('should throw an error if insufficient balance', async () => {
      const id = 1;
      const initialBalance = 1000000;
      const withdrawAmount = 1500000;

      prisma.bank_account.findUnique.mockResolvedValueOnce({ id, balance: initialBalance });

      const accountService = new AccountService();

      await expect(accountService.withdraw(id, withdrawAmount)).rejects.toThrow('Insufficient balance.');
    });

    it('should throw an error if withdraw failed', async () => {
      const id = 1;
      const initialBalance = 1000000;
      const withdrawAmount = 500000;

      prisma.bank_account.findUnique.mockResolvedValueOnce({ id, balance: initialBalance });
      prisma.bank_account.update.mockResolvedValueOnce(null);

      const accountService = new AccountService();

      await expect(accountService.withdraw(id, withdrawAmount)).rejects.toThrow('Withdrawal failed.');
    });
  });
});
