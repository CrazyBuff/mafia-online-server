import { createServer } from "http";
import { RawData, WebSocketServer } from "ws";
import { ClientsMap, SessionMap } from "./types";
import { validateSessionId, generateSessionId } from "./utils/helper-functions";
import { v4 as uuidv4 } from "uuid";

const server = createServer();

const port = 8080;
const baseWsUrl = `wss://localhost:${port}/`;

const sessions: SessionMap = {};
const clients: ClientsMap = {};

const handleMessage = (bytes: RawData, uuid: string) => {};

const handleClose = (uuid: string) => {
  console.log(`${clients[uuid].username} has disconnected`);

  const isHost = clients[uuid].host;
  const sessionId = clients[uuid].sessionId;
  delete clients[uuid];

  if (isHost) {
    console.log(`Session: ${sessionId} has been closed.`);

    sessions[sessionId].server.close();
    delete sessions[sessionId];
  }
};

const broadcast = (session: string, message: string) => {};

server.on("upgrade", (request, socket, head) => {
  // HTTP server should support multiple web socket servers
  const { searchParams } = new URL(request.url as string, baseWsUrl);
  console.log(`User attempting to connect to: ${request.url} `);

  const sessionId = searchParams.get("sessionId");
  const username = searchParams.get("username");

  if ((!sessionId || !validateSessionId(sessionId)) && !username) {
    socket.destroy();
    console.log(`Invalid upgrade request. Session Id: ${sessionId}  Username: ${username}`);
    return;
  }

  if (!sessionId) {
    const newSessionId = generateSessionId();

    const wss = new WebSocketServer({ noServer: true });

    // On Web Socket connection
    wss.on("connection", (ws, req) => {
      const { searchParams } = new URL(req.url as string, baseWsUrl);

      const uuid = uuidv4();
      const sessionId = searchParams.get("sessionId") as string;
      const username = searchParams.get("username") as string;
      console.log(`${username} has connected to session: ${sessionId}`);

      if (sessionId in sessions) {
        clients[uuid] = { sessionId: sessionId, username: username, connection: ws as any, host: false };
      } else {
        sessions[sessionId] = { server: ws as any };
        clients[uuid] = { sessionId: sessionId, username: username, connection: ws as any, host: true };
      }

      // Tell clients who has joined the session
      sessions[sessionId].server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`${username} has connected to session: ${sessionId}`);
        }
      });

      ws.on("message", (message) => handleMessage(message, uuid));
      ws.on("close", () => handleClose(uuid));
    });

    // Upgrading socket connection to web socket
    wss.handleUpgrade(request, socket, head, (ws) => {
      request.url = request.url + `&sessionId=${newSessionId}`;

      console.log(`Connection emitted to: ${request.url}`);
      wss.emit("connection", ws, request);
    });
  } else {
    if (!(sessionId in sessions)) {
      console.log("Session ID does not exist");
      socket.destroy();
      return;
    }

    const wss = sessions[sessionId].server;

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
