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
// NameSpace 1번
const namespace1 = io.of('/namespace1');
// connection을 받으면, news 이벤트에 hello 객체를 담아 보낸다
namespace1.on('connection', (socket) => {
  namespace1.emit('news', { hello: "Someone connected at namespace1" });
});
// NameSpace 2번
const namespace2 = io.of('/namespace2');
// connection을 받으면, news 이벤트에 hello 객체를 담아 보낸다
namespace2.on('connection', (socket) => {
  namespace2.emit('news', { hello: "Someone connected at Namespace2" });
});
  // io.on('connection', (socket) => {
  //   console.log('a user connected');
  //   socket.on('chat message', (msg) => {
  //     io.emit('chat message', msg);
  //   });
  //   socket.on('disconnect', () => {
  //   console.log('user disconnected');
  //   });
  // });
}


export default{
  init
}
//onst io = require('socket.io')(http);






