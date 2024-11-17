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

  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

main();
