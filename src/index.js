import express from 'express';
import routes from './routes/index.js';

const main = () => {
  const app = express();

  app.use(express.json());
  routes(app);

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
};

main();
