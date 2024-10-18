const { PrismaClient } = require('@prisma/client');
const db = require('../db/index');
const { ErrorResponse } = require('../response/errorResponse');

const prisma = new PrismaClient();

class AccountService {
  constructor(user_id, bank_name, bank_account_number, balance, id, amount, created_at, updated_at) {
    this.id = id;
    this.user_id = user_id;
    this.bank_name = bank_name;
    this.bank_account_number = bank_account_number;
    this.balance = balance;
    this.amount = amount;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  async getAllAccounts() {
    const allAccounts = await prisma.bank_account.findMany();

    if (allAccounts.length === 0) {
      throw new ErrorResponse(404, 'Accounts not found.');
    }

    return allAccounts;
  }

  async getAccountById(id) {
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
      throw new ErrorResponse(404, `Account with ID: ${id} not found.`);
    }

    return account;
  }

  async getCurrentBalanceById(id) {
    const account = await prisma.bank_account.findMany({
      where: {
        id: parseInt(id),
      },
      select: {
        balance: true,
      },
    });

    if (account.length === 0) {
      throw new ErrorResponse(404, `Account with ID: ${id} not found.`);
    }

    return account;
  }

  async addAccount() {
    const newAccount = await prisma.bank_account.create({
      data: {
        user_id: this.user_id,
        bank_name: this.bank_name,
        bank_account_number: this.bank_account_number,
        balance: this.balance,
      },
    });

    return newAccount;
  }

  async deposit() {
    const account = await prisma.bank_account.findUnique({
      where: {
        id: parseInt(this.id),
      },
    });

    if (!account) {
      throw new ErrorResponse(404, `Account with ID: ${this.id} not found.`);
    }

    const updatedAccount = await prisma.bank_account.update({
      where: {
        id: parseInt(this.id),
      },
      data: {
        balance: {
          increment: this.amount,
        },
      },
    });

    return updatedAccount;
  }

  async withdraw() {
    const account = await prisma.bank_account.findUnique({
      where: {
        id: parseInt(this.id),
      },
    });

    if (!account) {
      throw new ErrorResponse(404, `Account with ID: ${this.id} not found.`);
    }

    if (account.balance < this.amount) {
      throw new ErrorResponse(400, 'Insufficient balance.');
    }

    const updatedAccount = await prisma.bank_account.update({
      where: {
        id: parseInt(this.id),
      },
      data: {
        balance: {
          decrement: this.amount,
        },
      },
    });

    return updatedAccount;
  }
}

module.exports = { AccountService };
