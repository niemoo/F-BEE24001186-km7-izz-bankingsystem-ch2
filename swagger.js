const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Banking System API',
    description: 'API Documentation for Banking System',
  },
  host: 'localhost:3000',
};

const outputFile = './swagger-output.json';
const routes = ['./src/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc).then(() => {
  require('./src/index.js');
});
