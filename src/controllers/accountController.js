import { AccountService } from '../services/accountService.js';

export class AccountController {
  constructor() {
    this.accountService = new AccountService();
  }

  async getAllAccounts(req, res, next) {
    try {
      const data = await this.accountService.getAllAccounts();

      res.status(200).json({ data, message: 'Successfully get all accounts data.' });
    } catch (err) {
      next(err);
    }
  }

  async getAccountById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await this.accountService.getAccountById(id);

      res.status(200).json({
        data,
        message: `Successfully get account data by ID: ${id}.`,
      });
    } catch (err) {
      next(err);
    }
  }

  async getCurrentBalanceById(req, res, next) {
    try {
      const { id } = req.params;

      const data = await this.accountService.getCurrentBalanceById(id);

      res.status(200).json({
        balance: data[0].balance,
        message: `Successfully get current balance by bank account with ID: ${id}.`,
      });
    } catch (err) {
      next(err);
    }
  }

  async addAccount(req, res, next) {
    try {
      const value = req.body;

      const newAccount = new AccountService();

      const data = await newAccount.addAccount(value);

      res.status(201).json({
        data,
        message: 'Successfully created a new account.',
      });
    } catch (err) {
      next(err);
    }
  }

  async depositBalance(req, res, next) {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      const accountService = new AccountService();

      const updatedAccount = await accountService.deposit(id, amount);

      res.status(200).json({
        data: updatedAccount,
        message: 'Successfully deposit balance.',
      });
    } catch (err) {
      next(err);
    }
  }

  async withdrawBalance(req, res, next) {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      const accountService = new AccountService();

      const updatedAccount = await accountService.withdraw(id, amount);

      res.status(200).json({
        data: updatedAccount,
        message: 'Successfully withdraw balance.',
      });
    } catch (err) {
      next(err);
    }
  }
}
