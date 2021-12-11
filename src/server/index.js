const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');
const {PubSub} = require('@google-cloud/pubsub');

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
    console.log('preparing the connection!');
    ws.on("message", function (message) {
      console.log(`Received message ${message}`);
    });

    ws.on("close", function () {
      console.log("closing socket connection...");
    });

    listenForPubSubMessages(ws);
  });
  
app.get('/ws', (_, res) => res.send('this is a websocket endpoint. ask for an upgrade and you will get it!'));
app.get('/', (_, res) => res.sendFile('index.html', {root: path.join(__dirname, '../client/')}));

server.listen(PORT, function () {
  console.log(`Listening on http://localhost:${PORT}`);
});

async function listenForPubSubMessages(wsConnection) {
  const pubsub = new PubSub({projectId: 'websocket-server-334803'});
  const subscription = await pubsub.subscription('projects/websocket-server-334803/subscriptions/test-messages-sub');

  subscription.on("message", (message) => {
    console.log("Received message from pub/sub:", message.data.toString());
    wsConnection.send(message.data.toString());
  });

  subscription.on("error", (error) => {
    console.error("Received error:", error);
    process.exit(1);
  });
}