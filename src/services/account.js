const db = require('../db/index');

class AccountService {
  id = null;
  user_id = null;
  bank_name = null;
  bank_account_number = null;
  balance = null;
  created_at = null;
  updated_at = null;

  constructor(user_id, bank_name, bank_account_number, balance, created_at, updated_at) {
    this.user_id = user_id;
    this.bank_name = bank_name;
    this.bank_account_number = bank_account_number;
    this.balance = balance;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  async getCurrentBalance(account_id) {
    const query = `SELECT balance FROM bank_accounts WHERE id = $1`;

    const data = await db.query(query, [account_id]);

    const balance = data.rows[0].balance;

    return balance;
  }

  async deposit(account_id, amount) {
    const query = `UPDATE bank_accounts SET balance = balance + $1 WHERE id = $2 RETURNING balance`;

    const data = await db.query(query, [amount, account_id]);
  }
}

module.exports = { AccountService };
