class notNumberError extends Error {
  constructor(message) {
    super(message);
    this.name = 'notNumberError';
  }
}

class negativeAmountError extends Error {
  constructor(message) {
    super(message);
    this.name = 'negativeAmountError';
  }
}

class notEnoughBalanceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'notEnoughBalanceError';
  }
}

module.exports = { notNumberError, negativeAmountError, notEnoughBalanceError };
