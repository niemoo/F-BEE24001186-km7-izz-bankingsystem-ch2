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
}
