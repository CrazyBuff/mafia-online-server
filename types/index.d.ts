import { WebSocketServer } from "ws";

export interface SessionMap {
  [key: string]: {
    wss: WebSocketServer;
    clients: string[];
  };
}

export interface ClientsMap {
  [key: string]: {
    sessionId: string;
    host: boolean;
  };
}
