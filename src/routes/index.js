import { Router } from 'express';
import errorMiddleware from '../middleware/errorMiddleware.js';
import accounts from './accountRoute.js';
import users from './userRoute.js';
import transactions from './transactionRoute.js';

export default (app) => {
  const router = Router();

  app.use('/api/v1', router);

  users(router);
  accounts(router);
  transactions(router);

  app.use(errorMiddleware);
};
