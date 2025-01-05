import { WebSocketServer } from "ws";

export interface SessionMap {
  [key: string]: {
    server: WebSocketServer;
  };
}

export interface ClientsMap {
  [key: string]: {
    sessionId: string;
    username: string;
    connection: WebSocket;
    host: boolean;
  };
}
