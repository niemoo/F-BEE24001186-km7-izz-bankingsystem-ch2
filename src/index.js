import express from 'express';

// import swaggerUi from 'swagger-ui-express';
// import swaggerFile from '../swagger-output.json' assert { type: 'json' };
import routes from './routes/index.js';

const main = () => {
  const app = express();

  app.use(express.json());
  routes(app);

  // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
};

main();
