//const Server = require('socket.io');

import { Server } from 'socket.io'

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server, { path: '/api/socket.io'})
    res.socket.server.io = io

    let temp = 10;
    setInterval(() => {
      temp = temp + 1;
      if (temp > 20 ) {
        temp = 10;
      }
      io.emit('message', {temp: temp});
    } , 5000)

    res.socket.server.io = io;
  }
  res.end()
}

export default SocketHandler
