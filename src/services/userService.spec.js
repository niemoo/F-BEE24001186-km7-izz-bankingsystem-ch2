const { UserService } = require('./userService');
const { PrismaClient } = require('@prisma/client');

jest.mock('@prisma/client');

const mockedPrismaClient = {
  user: {
    findUnique: jest.fn(),
  },
};

const prisma = new PrismaClient();
prisma.user = mockedPrismaClient.user;

describe('get user data by ID', () => {
  it('should return user data by ID', async () => {
    mockedPrismaClient.findUnique.mockResolvedValueOnce({
      id: 5,
      name: 'Dono',
      email: 'dono@mail.com',
      password: 'secret',
    });

    const result = await UserService.getUserById(5);

    expect(result).toEqual({
      id: 5,
      name: 'Dono',
      email: 'dono@mail.com',
      password: 'secret',
    });
  });
});
