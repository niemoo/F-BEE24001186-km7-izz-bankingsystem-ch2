import { AccountController } from '../accountController.js';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    bank_account: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

describe('Account Controller', () => {
  let prisma;
  let accountController;
  let req, res, next;

  beforeEach(() => {
    prisma = new PrismaClient();
    accountController = new AccountController();
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

  describe('get all accounts', () => {
    it('should return all accounts and a success message', async () => {
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

      await accountController.getAllAccounts(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: accounts,
        message: 'Successfully get all accounts data.',
      });
    });

    it('should throw an error if no accounts found', async () => {
      prisma.bank_account.findMany.mockResolvedValueOnce([]);

      await accountController.getAllAccounts(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('Accounts not found.'));
    });
  });

  describe('get account by ID', () => {
    it('should return account data by ID and a success message', async () => {
      const account = {
        id: 1,
        user_id: 1,
        bank_name: 'Bank A',
        bank_account_number: '1234567890',
        balance: 1000000,
        created_at: '2024-10-27T09:11:25.866Z',
        updated_at: null,
        deleted_at: null,
      };

      prisma.bank_account.findUnique.mockResolvedValueOnce(account);

      req.params.id = account.id;

      await accountController.getAccountById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: account,
        message: `Successfully get account data by ID: ${account.id}.`,
      });
    });

    it('should throw an error if account not found', async () => {
      const id = 1;
      prisma.bank_account.findUnique.mockResolvedValueOnce(null);

      req.params.id = id;

      await accountController.getAccountById(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(new Error(`Account with ID: ${id} not found.`));
    });

    describe('get current balance by ID', () => {
      it('should return current balance by ID and a success message', async () => {
        const id = 1;
        const account = [
          {
            balance: 1000000,
          },
        ];

        prisma.bank_account.findMany.mockResolvedValueOnce(account);

        req.params.id = 1;

        await accountController.getCurrentBalanceById(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          balance: account[0].balance,
          message: `Successfully get current balance by bank account with ID: ${id}.`,
        });
      });

      it('should throw an error if account not found', async () => {
        const id = 1;
        prisma.bank_account.findMany.mockResolvedValueOnce([]);

        req.params.id = id;

        await accountController.getCurrentBalanceById(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next).toHaveBeenCalledWith(new Error(`Account with ID: ${id} not found.`));
      });
    });

    describe('add a new account', () => {
      it('should create a new account and return a success message', async () => {
        const account = {
          user_id: 1,
          bank_name: 'Bank A',
          bank_account_number: '1234567890',
          balance: 1000000,
        };

        req.body = account;
        prisma.bank_account.create.mockResolvedValueOnce(account);

        await accountController.addAccount(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          data: account,
          message: 'Successfully created a new account.',
        });
      });

      it('should throw an error if failed to create a new account', async () => {
        const account = {
          user_id: 1,
          bank_name: 'Bank A',
          bank_account_number: '1234567890',
          balance: 1000000,
        };

        req.body = account;

        const errorMessage = new Error('Bank account creation failed.');
        prisma.bank_account.create.mockRejectedValueOnce(errorMessage);

        await accountController.addAccount(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next).toHaveBeenCalledWith(errorMessage);
      });
    });
  });
});
