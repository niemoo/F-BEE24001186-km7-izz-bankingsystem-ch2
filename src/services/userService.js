import { PrismaClient } from '@prisma/client';
import { ErrorResponse } from '../response/errorResponse.js';

const prisma = new PrismaClient();

export class UserService {
  static async getAllUsers() {
    const allUsers = await prisma.user.findMany();

    if (allUsers.length === 0) {
      throw new ErrorResponse(404, 'Users not found.');
    }

    return allUsers;
  }

  static async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        Profile: true,
      },
    });

    if (!user) {
      throw new ErrorResponse(404, `User with ID: ${id} not found.`);
    }

    return user;
  }

  async addUser(data) {
    const checkUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (checkUser) {
      throw new ErrorResponse(409, 'Email already registered.');
    }

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        Profile: {
          create: {
            identity_type: data.identity_type,
            identity_number: data.identity_number,
            address: data.address,
          },
        },
      },
      include: {
        Profile: true,
      },
    });

    if (!newUser) {
      throw new ErrorResponse(500, 'User creation failed.');
    }

    return newUser;
  }
}
