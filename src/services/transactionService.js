const { PrismaClient } = require('@prisma/client');
const db = require('../db/index');
const { ErrorResponse } = require('../response/errorResponse');

const prisma = new PrismaClient();

class TransactionService {
  constructor(source_account_id, destination_account_id, amount) {
    this.source_account_id = source_account_id;
    this.destination_account_id = destination_account_id;
    this.amount = amount;
  }

  async getAllTransactions() {
    const allTransactions = await prisma.transaction.findMany();

    if (allTransactions.length === 0) {
      throw new ErrorResponse(404, 'Transactions not found.');
    }

    return allTransactions;
  }

  async getTransactionById(id) {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        sourceAccount: {
          include: {
            user: true,
          },
        },
        destinationAccount: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new ErrorResponse(404, `Transaction with ID: ${id} not found.`);
    }

    return transaction;
  }

  async transferBalance() {
    const sourceAccount = await prisma.bank_account.findUnique({
      where: {
        id: parseInt(this.source_account_id),
      },
    });

    if (!sourceAccount) {
      throw new ErrorResponse(404, `Source account with ID: ${this.source_account_id} not found.`);
    }

    const destinationAccount = await prisma.bank_account.findUnique({
      where: {
        id: parseInt(this.destination_account_id),
      },
    });

    if (!destinationAccount) {
      throw new ErrorResponse(404, `Destination account with ID: ${this.destination_account_id} not found.`);
    }

    if (sourceAccount.balance < this.amount) {
      throw new ErrorResponse(400, 'Insufficient balance.');
    }

    const updatedSourceAccount = await prisma.bank_account.update({
      where: {
        id: parseInt(this.source_account_id),
      },
      data: {
        balance: {
          decrement: this.amount,
        },
      },
    });

    const updatedDestinationAccount = await prisma.bank_account.update({
      where: {
        id: parseInt(this.destination_account_id),
      },
      data: {
        balance: {
          increment: this.amount,
        },
      },
    });

    const transaction = await prisma.transaction.create({
      data: {
        source_account_id: parseInt(this.source_account_id),
        destination_account_id: parseInt(this.destination_account_id),
        amount: this.amount,
      },
    });

    return transaction;
  }
}

module.exports = { TransactionService };
