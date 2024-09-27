function prompt(rl, bankAccount) {
  rl.question(
    `
=== fufufafa Bank Account ===
1. Deposit money
2. Withdraw money
3. Check balance
4. Exit
Input selection option : `,
    (option) => {
      switch (option) {
        case '1':
          rl.question('\nEnter the amount to be deposited : ', async (amount) => {
            try {
              const response = await bankAccount.deposit(parseFloat(amount));
              console.log(`\n${response}`);
            } catch (err) {
              console.error(`Error: ${err.message}`);
            }

            prompt(rl, bankAccount);
          });

          break;

        case '2':
          rl.question('\nEnter the amount to be withdraw : ', async (amount) => {
            try {
              const response = await bankAccount.withdraw(amount);
              console.log(`\n${response}`);
            } catch (err) {
              console.error(`Error: ${err.message}`);
            }

            prompt(rl, bankAccount);
          });
          break;

        case '3':
          (async () => {
            try {
              const response = await bankAccount.balanceCheck();
              console.log(`\n${response}`);
            } catch (err) {
              console.error(`Error: ${err.message}`);
            }

            prompt(rl, bankAccount);
          })();

          break;

        case '4':
          rl.close();
          break;

        default:
          console.log('\nInput is not available.');
          prompt(rl, bankAccount);
          break;
      }
    }
  );
}

module.exports = { prompt };
