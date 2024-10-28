import { PrismaClient } from '@prisma/client';
import { ErrorResponse } from '../response/errorResponse.js';

const prisma = new PrismaClient();

export class AccountService {
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

  async addAccount(data) {
    const newAccount = await prisma.bank_account.create({
      data: {
        user_id: data.user_id,
        bank_name: data.bank_name,
        bank_account_number: data.bank_account_number,
        balance: data.balance,
      },
    });

    if (!newAccount) {
      throw new ErrorResponse(500, 'Bank account creation failed.');
    }

    return newAccount;
  }

  async deposit(id, amount) {
    const account = await prisma.bank_account.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!account) {
      throw new ErrorResponse(404, `Account with ID: ${id} not found.`);
    }

    const updatedAccount = await prisma.bank_account.update({
      where: {
        id: parseInt(id),
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    if (!updatedAccount) {
      throw new ErrorResponse(500, 'Deposit failed.');
    }

    return updatedAccount;
  }

  async withdraw(id, amount) {
    const account = await prisma.bank_account.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!account) {
      throw new ErrorResponse(404, `Account with ID: ${id} not found.`);
    }

    if (account.balance < amount) {
      throw new ErrorResponse(400, 'Insufficient balance.');
    }

    const updatedAccount = await prisma.bank_account.update({
      where: {
        id: parseInt(id),
      },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    if (!updatedAccount) {
      throw new ErrorResponse(500, 'Withdrawal failed.');
    }

    return updatedAccount;
  }
}
