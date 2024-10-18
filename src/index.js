const express = require('express');
const accounts = require('./routes/accountRoute.js');
const users = require('./routes/userRoute.js');
const transaction = require('./routes/transactionRoute.js');
const errorMiddleware = require('./middleware/errorMiddleware.js');

const main = () => {
  const app = express();

  app.use(express.json());

  accounts(app);
  users(app);
  transaction(app);

  app.use(errorMiddleware);

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
};

main();
