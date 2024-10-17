const express = require('express');
const accounts = require('./routes/account.js');
const users = require('./routes/user.js');

const app = express();

app.use(express.json());

accounts(app);
users(app);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
