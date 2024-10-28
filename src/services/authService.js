import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ErrorResponse } from '../response/errorResponse.js';

const prisma = new PrismaClient();

export class AuthService {
  async login(data) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new ErrorResponse(404, 'User not found.');
    }

    if (user.password !== data.password) {
      throw new ErrorResponse(400, 'Invalid credentials.');
    }

    const token = jwt.sign({ id: user.id, name: 'fufufafa' }, 'asddas', {
      expiresIn: '1d',
    });

    return { token };
  }
}
