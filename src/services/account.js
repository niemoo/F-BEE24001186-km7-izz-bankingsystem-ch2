const db = require('../db/index');

class AccountService {
  id = null;
  id_customer = null;
  type = null;
  balance = null;
  created_at = null;
  updated_at = null;

  constructor(id_customer, type, balance, created_at, updated_at) {
    this.id_customer = id_customer;
    this.type = type;
    this.balance = balance;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  async getCurrentBalance(accountId) {
    const query = `SELECT balance FROM accounts WHERE id = $1`;

    const data = await db.query(query, [accountId]);

    const balance = data.rows[0].balance;

    return balance;
  }
}

module.exports = { AccountService };
