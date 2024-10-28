import { UserService } from '../userService.js';
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

describe('Users Service', () => {
  let prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get all users', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: 1,
          name: 'Mulyono',
          email: 'mulyono@mail.com',
          password: 'mulyono',
          created_at: '2024-10-27T09:11:25.866Z',
          updated_at: null,
          deleted_at: null,
        },
        {
          id: 2,
          name: 'Fufufafa',
          email: 'fufufafa@mail.com',
          password: 'fufufafa',
          created_at: '2024-10-27T09:11:27.868Z',
          updated_at: null,
          deleted_at: null,
        },
      ];

      prisma.user.findMany.mockResolvedValueOnce(users);

      const result = await UserService.getAllUsers();
      expect(result).toEqual(users);
    });

    it('should throw an error if users not found', async () => {
      prisma.user.findMany.mockResolvedValueOnce([]);

      await expect(UserService.getAllUsers()).rejects.toThrow('Users not found.');
    });
  });

  describe('get user data by ID', () => {
    it('should return user data by ID', async () => {
      const user = {
        id: 1,
        name: 'Mulyono',
        email: 'mulyono@mail.com',
        password: 'mulyono',
        created_at: '2024-10-27T09:11:25.866Z',
        updated_at: null,
        deleted_at: null,
        Profile: [
          {
            id: 1,
            user_id: 1,
            identity_type: 'KTP',
            identity_number: '882918213',
            address: 'Jl. Chili Pari 02',
            created_at: '2024-10-27T09:11:25.866Z',
            updated_at: null,
            deleted_at: null,
          },
        ],
      };

      prisma.user.findUnique.mockResolvedValueOnce(user);

      const result = await UserService.getUserById(1);
      expect(result).toEqual(user);
    });

    it('should throw an error if user not found', async () => {
      const id = 1;

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(UserService.getUserById(id)).rejects.toThrow(`User with ID: ${id} not found.`);
    });
  });

  describe('add new user', () => {
    it('should add new user', async () => {
      const user = {
        name: 'Mulyono',
        email: 'mulyono@mail.com',
        password: 'mulyono',
        identity_type: 'KTP',
        identity_number: '882918213',
        address: 'Jl. Chili Pari 02',
      };

      prisma.user.create.mockResolvedValueOnce(user);

      const userService = new UserService();

      const result = await userService.addUser(user);

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

      const userService = new UserService();

      await expect(userService.addUser(user)).rejects.toThrow('Email already registered.');
    });
  });
});
