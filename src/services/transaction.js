const { PrismaClient } = require('@prisma/client');
const db = require('../db/index');
const { ErrorResponse } = require('../response/error');

const prisma = new PrismaClient();

class TransactionService {
  constructor(id, source_account_id, destination_account_id, amount) {
    this.id = id;
    this.source_account_id = source_account_id;
    this.destination_account_id = destination_account_id;
    this.amount = amount;
  }
}

module.exports = { TransactionService };
