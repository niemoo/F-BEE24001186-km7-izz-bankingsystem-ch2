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
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async getUserById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      return user;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
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
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
}

module.exports = { UserService };
