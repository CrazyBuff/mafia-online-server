import { createServer } from "http";
import WebSocket from "ws";
import { ClientsMap, SessionMap } from "./types";
import { validateSessionId } from "./utils/helper-functions";

const server = createServer();

const sessions: SessionMap = {};
const clients: ClientsMap = {};

server.on("upgrade", (request, socket, head) => {
  const { searchParams } = new URL((request as any).url, "wss://localhost");

  if (searchParams.get("gameId")) {
    const sessionId = searchParams.get("sessionId") as string;

    if (!validateSessionId(sessionId)) {
      socket.destroy();
      return;
    }

    if (sessionId in sessions) {
    }
  } else {
    socket.destroy();
    return;
  }
});
