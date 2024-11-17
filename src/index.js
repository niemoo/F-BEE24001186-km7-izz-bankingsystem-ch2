import './libs/sentry.js';
import * as Sentry from '@sentry/node';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import express from 'express';
import { join } from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

const app = express();
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const server = createServer(app);
export const io = new Server(server);

const main = () => {
  dotenv.config();
  const __dirname = process.cwd();

  app.use(cors(corsOptions));
  app.use(express.json());
  routes(app);

  app.use((req, res, next) => {
    res.locals.io = io;
    next();
  });

  app.set('views', __dirname + '/src/views');

  app.use('/notifications', (req, res) => {
    res.sendFile(join(__dirname, '/src/views/index.html'));
  });

  io.on('connection', (socket) => {
    console.log('New user connected: ', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected: ', socket.id);
    });
  });

  Sentry.setupExpressErrorHandler(app);

  app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + '\n');
  });

  app.get('/debug-sentry', function mainHandler(req, res) {
    throw new Error('My first Sentry error!');
  });

  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

main();
