const { PrismaClient } = require('@prisma/client');
const db = require('../db/index');
const { ErrorResponse } = require('../response/error');

const prisma = new PrismaClient();

class AccountService {
  constructor(user_id, bank_name, bank_account_number, balance, created_at, updated_at) {
    this.user_id = user_id;
    this.bank_name = bank_name;
    this.bank_account_number = bank_account_number;
    this.balance = balance;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  async getAllAccounts() {
    try {
      const allAccounts = await prisma.bank_account.findMany();

      return allAccounts;
    } catch (err) {
      console.error('Error fetching accounts:', err);
      throw err;
    }
  }

  async getAccountById(id) {
    try {
      const account = await prisma.bank_account.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!account) {
        throw new ErrorResponse(404, 'Account not found');
      }

      return account;
    } catch (err) {
      throw err;
    }
  }

  async getCurrentBalanceById(id) {
    try {
      const account = await prisma.bank_account.findMany({
        where: {
          id: parseInt(id),
        },
        select: {
          balance: true,
        },
      });

      return account;
    } catch (err) {
      console.error('Error fetching users:', err);
      throw err;
    }
  }

  async addAccount() {
    try {
      const newAccount = await prisma.bank_account.create({
        data: {
          user_id: this.user_id,
          bank_name: this.bank_name,
          bank_account_number: this.bank_account_number,
          balance: this.balance,
        },
      });

      return newAccount;
    } catch (err) {
      console.error('Error creating account:', err);
      throw err;
    }
  }
}

module.exports = { AccountService };
