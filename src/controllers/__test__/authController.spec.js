import { AuthController } from '../authController.js';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

describe('Auth Controller', () => {
  let prisma;
  let authController;
  let req, res, next;

  beforeEach(() => {
    prisma = new PrismaClient();
    authController = new AuthController();
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

  describe('add a new user', () => {
    it('should create a new user and return a success message', async () => {
      const user = {
        name: 'Mulyono',
        email: 'mulyono@mail.com',
        password: 'mulyono',
        identity_type: 'KTP',
        identity_number: '882918213',
        address: 'Jl. Chili Pari 02',
      };

      req.body = user;
      prisma.user.create.mockResolvedValueOnce(user);

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: user,
        message: 'Successfully created a new user.',
      });
    });

    it('should throw an error if failed to create a new user', async () => {
      const user = {
        name: 'Mulyono',
        email: 'mulyono@mail.com',
        password: 'mulyono',
        identity_type: 'KTP',
        identity_number: '882918213',
        address: 'Jl. Chili Pari 02',
      };

      req.body = user;

      const errorMessage = new Error('Failed to create user.');
      prisma.user.create.mockRejectedValueOnce(errorMessage);

      await authController.register(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(errorMessage);
    });
  });
});
