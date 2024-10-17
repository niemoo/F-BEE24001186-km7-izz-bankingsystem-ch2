const db = require('../db/index');

class AccountService {
  constructor(user_id, bank_name, bank_account_number, balance, created_at, updated_at) {
    this.user_id = user_id;
    this.bank_name = bank_name;
    this.bank_account_number = bank_account_number;
    this.balance = balance;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  async getCurrentBalance(id) {
    const query = `SELECT balance FROM bank_accounts WHERE id = $1`;

    const data = await db.query(query, [id]);

    const balance = data.rows[0].balance;

    return balance;
  }
}

module.exports = { AccountService };
