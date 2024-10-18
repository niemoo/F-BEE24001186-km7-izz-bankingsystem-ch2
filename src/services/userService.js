const { PrismaClient } = require('@prisma/client');
const db = require('../db/index');
const { ErrorResponse } = require('../response/errorResponse');

const prisma = new PrismaClient();

class UserService {
  constructor(name, email, password, identity_type, identity_number, address) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.identity_type = identity_type;
    this.identity_number = identity_number;
    this.address = address;
  }

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

  async addUser() {
    const newUser = await prisma.user.create({
      data: {
        name: this.name,
        email: this.email,
        password: this.password,
        Profile: {
          create: {
            identity_type: this.identity_type,
            identity_number: this.identity_number,
            address: this.address,
          },
        },
      },
      include: {
        Profile: true,
      },
    });

    return newUser;
  }
}

module.exports = { UserService };
