import readline from 'node:readline';
import { BankAccount } from './bank_account.js';
import { prompt } from '../../.js';

function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const newAccount = new BankAccount(0);
  prompt(rl, newAccount);
}

main();
