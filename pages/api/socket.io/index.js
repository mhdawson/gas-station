import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server, { path: '/api/socket.io'})
    res.socket.server.io = io

    let temp = 10;
    let left = false;
    let right = false;
    setInterval(() => {
      temp = temp + 1;
      if (temp > 20 ) {
        temp = 10;
      };

      if (!left && !right) {  
        left = true;
        right = false; 
      } else if (left && !right) {  
        left = false;
        right = true;
      } else if (!left && right) {  
        left = true;
        right = true;
      } else if (left && right) {  
        left = false;
        right = false;
      };

      io.emit('message', {temp: temp, topLeft: left, topRight: right});
    } , 5000)

    res.socket.server.io = io;
  }
  res.end();
}

export default SocketHandler;
