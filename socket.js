import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { Server } from "socket.io";

let io = null;
const init = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
    console.log('user disconnected');
    });
  });
}

export default{
  init
}
//onst io = require('socket.io')(http);






