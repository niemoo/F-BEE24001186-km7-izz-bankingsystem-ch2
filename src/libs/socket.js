import { io } from '../index.js';

export class Notification {
  static async push(message) {
    console.log(message);
    io.emit('notifications', { message });
  }
}
