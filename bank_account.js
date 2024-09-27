const { notNumberError, negativeAmountError, notEnoughBalanceError } = require('./error_service');

class BankAccount {
  constructor(accountBalance) {
    this.accountBalance = accountBalance;
  }

  deposit(amount) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (isNaN(amount)) {
          reject(new notNumberError('Input harus berupa angka.'));
        } else if (amount < 0) {
          reject(new negativeAmountError('Input tidak boleh kurang dari 0.'));
        } else if (amount > 0) {
          this.accountBalance += amount;
          resolve('Saldo berhasil ditambah.');
        }
      }, 1000);
    });
  }

  withdraw(amount) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (isNaN(amount)) {
          reject(new notNumberError('Input harus berupa angka.'));
        } else if (amount < 0) {
          reject(new negativeAmountError('Input tidak boleh kurang dari 0.'));
        } else if (amount > 0 && amount <= this.accountBalance) {
          this.accountBalance -= amount;
          resolve('Saldo berhasil dikurangi.');
        } else {
          reject(new notEnoughBalanceError('Saldo tidak mencukupi.'));
        }
      }, 1000);
    });
  }
}

module.exports = { BankAccount };
