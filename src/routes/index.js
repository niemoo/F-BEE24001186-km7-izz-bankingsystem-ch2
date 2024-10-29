import { Router } from 'express';
import errorMiddleware from '../middleware/errorMiddleware.js';
import accounts from './accountRoute.js';
import users from './userRoute.js';
import transactions from './transactionRoute.js';
import auth from './authRoute.js';

import { readFileSync } from 'fs';
import swaggerUi from 'swagger-ui-express';
const swaggerDocument = JSON.parse(readFileSync(new URL('../swagger-output.json', import.meta.url)));

export default (app) => {
  const router = Router();

  app.use('/api/v1', router);

  users(router);
  accounts(router);
  transactions(router);
  auth(router);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(errorMiddleware);
};
