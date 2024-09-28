const readline = require('node:readline');
const { BankAccount } = require('./bank_account');
const { prompt } = require('./prompt');

function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const newAccount = new BankAccount(0);
  prompt(rl, newAccount);
}

main();
