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
  let room = ['room1', 'room2'];
  let a = 0; 
  //ㄴㅇㅁㄴㅇ
  io.on('connection', (socket) => {
  

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  
    socket.on('leaveRoom', (num, name) => {
      socket.leave(room[num], () => {
        console.log(name + ' leave a ' + room[num]);
        io.to(room[num]).emit('leaveRoom', num, name); //특정 룸에게 이ㄴㅡ보냄
      });
    });
  
    socket.on('joinRoom', (num, name) => {
      socket.join(room[num], () => {
        console.log(name + ' join a ' + room[num]);
        io.to(room[num]).emit('joinRoom', num, name);
      });
    });
  
    socket.on('chat message', (num, name, msg) => {
      a = num;
      io.to(room[a]).emit('chat message', name, msg);
    });
  });
}


export default{
  init
}
//onst io = require('socket.io')(http);






