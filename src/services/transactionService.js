import { PrismaClient } from '@prisma/client';
import { ErrorResponse } from '../response/errorResponse.js';

const prisma = new PrismaClient();

export class TransactionService {
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

  async transferBalance(source_account_id, destination_account_id, amount) {
    const sourceAccount = await prisma.bank_account.findUnique({
      where: {
        id: parseInt(source_account_id),
      },
    });

    if (!sourceAccount) {
      throw new ErrorResponse(404, `Source account with ID: ${source_account_id} not found.`);
    }

    const destinationAccount = await prisma.bank_account.findUnique({
      where: {
        id: parseInt(destination_account_id),
      },
    });

    if (!destinationAccount) {
      throw new ErrorResponse(404, `Destination account with ID: ${destination_account_id} not found.`);
    }

    if (sourceAccount.balance < amount) {
      throw new ErrorResponse(400, 'Insufficient balance.');
    }

    const updatedSourceAccount = await prisma.bank_account.update({
      where: {
        id: parseInt(source_account_id),
      },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    const updatedDestinationAccount = await prisma.bank_account.update({
      where: {
        id: parseInt(destination_account_id),
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    const transaction = await prisma.transaction.create({
      data: {
        source_account_id: parseInt(source_account_id),
        destination_account_id: parseInt(destination_account_id),
        amount: amount,
      },
    });

    if (!transaction) {
      throw new ErrorResponse(500, 'Transfer balance failed.');
    }

    return transaction;
  }
}
