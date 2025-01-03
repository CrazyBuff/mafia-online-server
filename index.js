import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import configure from "./routers";

const app = express();
const port = process.env.PORT || 3000;

// Error in HTTP handler
function onSocketPreError(e) {
  console.log(e);
}

// Error in Web Socket handler
function onSocketPostError(e) {
  console.log(e);
}

configure(app);

console.long(`Attempting to run server on port ${port}`);

const s = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// allows multiple instantiations of web socket servers on the same HTTP server
const wss = new WebSocketServer({ noServer: true });

s.on("upgrade", (req, socket, head) => {
  socket.on("error", onSocketPreError);

  // perform auth
  if (!!req.headers["BadAuth"]) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    socket.removeListener("error", onSocketPreError);
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", (ws, req) => {
  ws.on("error", onSocketPostError);

  ws.on("message", (msg, isBinary) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg, { binary: isBinary });
      }
    });
  });

  ws.on("close", () => {
    console.log("Connection closed");
  });
});
