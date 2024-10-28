export class notNumberError extends Error {
  constructor(message) {
    super(message);
    this.name = 'notNumberError';
  }
}

export class negativeAmountError extends Error {
  constructor(message) {
    super(message);
    this.name = 'negativeAmountError';
  }
}

export class notEnoughBalanceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'notEnoughBalanceError';
  }
}
