const { PrismaClient } = require('@prisma/client');
const db = require('../db/index');

const prisma = new PrismaClient();

class UserService {
  constructor(name, email, password, created_at, updated_at) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static async getAllUsers() {
    try {
      const allUsers = await prisma.user.findMany();

      return allUsers;
    } catch (err) {
      console.error('Error fetching users:', err);
      throw err;
    }
  }

  static async getUserById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      return user;
    } catch (err) {
      console.error('Error fetching user by ID:', err);
      throw err;
    }
  }

  async addUser() {
    try {
      const newUser = await prisma.user.create({
        data: {
          name: this.name,
          email: this.email,
          password: this.password,
        },
      });

      return newUser;
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  }
}

module.exports = { UserService };
