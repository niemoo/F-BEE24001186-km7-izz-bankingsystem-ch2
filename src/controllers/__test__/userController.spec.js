import { UserController } from '../userController.js';
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

describe('User Controller', () => {
  let prisma;
  let userController;
  let req, res, next;

  beforeEach(() => {
    prisma = new PrismaClient();
    userController = new UserController();
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

  describe('get all users', () => {
    it('should return all users and a success message', async () => {
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

      await userController.getAllUsers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: users,
        message: 'Successfully get all users data.',
      });
    });

    it('should throw an error if users not found', async () => {
      prisma.user.findMany.mockResolvedValueOnce([]);

      await userController.getAllUsers(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(new Error('Users not found.'));
    });
  });

  describe('get user data by ID', () => {
    it('should return user data by ID and a success message', async () => {
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

      req.params.id = user.id;
      prisma.user.findUnique.mockResolvedValueOnce(user);

      await userController.getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: user,
        message: `Successfully get user data by ID: ${user.id}.`,
      });
    });

    it('should throw an error if user not found', async () => {
      const id = 1;
      req.params.id = id;

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await userController.getUserById(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(new Error(`User with ID: ${id} not found.`));
    });
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

      await userController.addUser(req, res, next);

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

      await userController.addUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(errorMessage);
    });
  });
});
