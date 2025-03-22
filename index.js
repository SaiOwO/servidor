'use strict';
const express = require('express');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = require("socket.io")(server,{
  cors: {
    origins: "*:*",
    methods: ["GET", "POST"]
  }
});
io.on('connection', (socket) => {
  socket.on('disconnect', () => console.log('Client disconnected'));
  socket.on('messaged', (args) => {
    io.emit('message', args);
    console.log(args)
  });
   socket.on('event_name', (...args) => {
    io.emit('message2', args);
     console.log(args)
  });
});
