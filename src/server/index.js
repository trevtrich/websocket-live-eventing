const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 8000

const server = http.createServer(app);
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

server.on('upgrade', function (request, socket, head) {
    console.log('handling upgrade from http server. attempting websocket connection...');
  
    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit('connection', ws, request);
    });
  });

  wss.on("connection", function (ws, request) {
    ws.on("message", function (message) {
      console.log(`Received message ${message}`);
    });

    ws.on("close", function () {
      console.log("closing socket connection...");
    });
  });
  
app.get('/ws', (_, res) => res.send('this is a websocket endpoint. ask for an upgrade and you will get it!'));

server.listen(PORT, function () {
  console.log(`Listening on http://localhost:${PORT}`);
});