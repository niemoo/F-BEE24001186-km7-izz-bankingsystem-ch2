import { AuthService } from '../authService.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
  let prisma;
  let authService;

  beforeEach(() => {
    prisma = new PrismaClient();
    authService = new AuthService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register new user', () => {
    it('should register new user', async () => {
      const user = {
        name: 'Mulyono',
        email: 'mulyono@mail.com',
        password: 'mulyono',
        identity_type: 'KTP',
        identity_number: '882918213',
        address: 'Jl. Chili Pari 02',
      };

      prisma.user.create.mockResolvedValueOnce(user);

      const authService = new AuthService();

      const result = await authService.register(user);

      expect(result).toEqual(user);
    });

    it('should throw an error if email already registered', async () => {
      const user = {
        name: 'Mulyono',
        email: 'mulyono@mail.com',
        password: 'mulyono',
        identity_type: 'KTP',
        identity_number: '882918213',
        address: 'Jl. Chili Pari 02',
      };

      prisma.user.findUnique.mockResolvedValueOnce(user);

      const authService = new AuthService();

      await expect(authService.register(user)).rejects.toThrow('Email already registered.');
    });

    it('should throw an error if user registration fails', async () => {
      const user = {
        name: 'Mulyono',
        email: 'mulyono@mail.com',
        password: 'mulyono',
        identity_type: 'KTP',
        identity_number: '882918213',
        address: 'Jl. Chili Pari 02',
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);
      prisma.user.create.mockResolvedValueOnce(null);

      const authService = new AuthService();

      await expect(authService.register(user)).rejects.toThrow('User registration failed.');
    });
  });

  describe('login user', () => {
    it('should login user and return token if credentials are correct', async () => {
      const user = {
        id: '123',
        email: 'mulyono@mail.com',
        password: 'hashedPassword',
      };

      const loginData = { email: 'mulyono@mail.com', password: 'mulyono' };

      prisma.user.findUnique.mockResolvedValueOnce(user);
      bcrypt.compare.mockResolvedValueOnce(true);
      jwt.sign.mockReturnValueOnce('mockToken');

      const result = await authService.login(loginData);

      expect(result).toEqual({ token: 'mockToken' });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: loginData.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, user.password);
      expect(jwt.sign).toHaveBeenCalledWith({ id: user.id }, 'asddas', { expiresIn: '1d' });
    });

    it('should throw an error if user not found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(authService.login({ email: 'nonexistent@mail.com', password: 'password' })).rejects.toThrow('User not found.');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'nonexistent@mail.com' } });
    });

    it('should throw an error if password is incorrect', async () => {
      const user = { id: '123', email: 'mulyono@mail.com', password: 'hashedPassword' };

      prisma.user.findUnique.mockResolvedValueOnce(user);
      bcrypt.compare.mockResolvedValueOnce(false);

      await expect(authService.login({ email: 'mulyono@mail.com', password: 'wrongPassword' })).rejects.toThrow('Password is incorrect.');

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', user.password);
    });
  });
});
