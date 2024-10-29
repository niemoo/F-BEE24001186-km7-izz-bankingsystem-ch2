import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { ErrorResponse } from '../response/errorResponse.js';

const prisma = new PrismaClient();

export class AuthService {
  async register(data) {
    const checkUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (checkUser) {
      throw new ErrorResponse(409, 'Email already registered.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
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
      throw new ErrorResponse(500, 'User registration failed.');
    }

    return newUser;
  }

  async login(data) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new ErrorResponse(404, 'User not found.');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new ErrorResponse(400, 'Password is incorrect.');
    }

    const token = jwt.sign({ id: user.id }, 'asddas', {
      expiresIn: '1d',
    });

    return { token };
  }
}
