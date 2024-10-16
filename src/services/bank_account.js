const { notNumberError, negativeAmountError, notEnoughBalanceError } = require('./error_service');

class BankAccount {
  constructor(accountBalance) {
    this.accountBalance = accountBalance;
  }

  #formattedBalance() {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(this.accountBalance);
  }

  deposit(amount) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (isNaN(amount)) {
          reject(new notNumberError('Input must be a number.'));
        } else if (amount < 0) {
          reject(new negativeAmountError('Input cannot be less than 0.'));
        } else if (amount > 0) {
          this.accountBalance += amount;
          resolve(`Balance added successfully.\nYour balance now : ${this.#formattedBalance()}`);
        }
      }, 1000);
    });
  }

  withdraw(amount) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (isNaN(amount)) {
          reject(new notNumberError('Input must be a number.'));
        } else if (amount < 0) {
          reject(new negativeAmountError('Input cannot be less than 0.'));
        } else if (amount > 0 && amount <= this.accountBalance) {
          this.accountBalance -= amount;
          resolve(`Withdraw money successfully.\nYour balance now : Rp ${this.#formattedBalance()}`);
        } else {
          reject(new notEnoughBalanceError('Insufficient balance.'));
        }
      }, 1000);
    });
  }

  balanceCheck() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Your balance : ${this.#formattedBalance()}`);
      }, 1000);
    });
  }
}

module.exports = { BankAccount };
