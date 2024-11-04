import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

const main = () => {
  const app = express();
  dotenv.config();
  app.use(cors());
  app.use(express.json());
  routes(app);

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
};

main();
