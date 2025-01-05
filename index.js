"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var ws_1 = require("ws");
var helper_functions_1 = require("./utils/helper-functions");
var uuid_1 = require("uuid");
var server = (0, http_1.createServer)();
var port = 8080;
var baseWsUrl = "wss://localhost:".concat(port);
var sessions = {};
var clients = {};
var handleMessage = function (bytes, uuid) { };
var handleClose = function (uuid) {
    console.log("".concat(clients[uuid].username, " has disconnected"));
    var isHost = clients[uuid].host;
    var sessionId = clients[uuid].sessionId;
    delete clients[uuid];
    if (isHost) {
        console.log("Session: ".concat(sessionId, " has been closed."));
        sessions[sessionId].server.close();
        delete sessions[sessionId];
    }
};
var broadcast = function (session, message) { };
server.on("upgrade", function (request, socket, head) {
    var searchParams = new URL(request.url, baseWsUrl).searchParams;
    console.log("User attempting to connect to: ".concat(request.url, " "));
    var sessionId = searchParams.get("sessionId");
    var username = searchParams.get("username");
    if ((!sessionId || !(0, helper_functions_1.validateSessionId)(sessionId)) && !username) {
        socket.destroy();
        console.log("Invalid upgrade request. Session Id: ".concat(sessionId, "  Username: ").concat(username));
        return;
    }
    if (!sessionId) {
        var newSessionId_1 = (0, helper_functions_1.generateSessionId)();
        var wss_1 = new ws_1.WebSocketServer({ noServer: true });
        // On Web Socket connection
        wss_1.on("connection", function (ws, req) {
            var searchParams = new URL(req.url, baseWsUrl).searchParams;
            var uuid = (0, uuid_1.v4)();
            var sessionId = searchParams.get("sessionId");
            var username = searchParams.get("username");
            console.log("".concat(username, " has connected to session: ").concat(sessionId));
            if (sessionId in sessions) {
                clients[uuid] = { sessionId: sessionId, username: username, connection: ws, host: false };
            }
            else {
                sessions[sessionId] = { server: ws };
                clients[uuid] = { sessionId: sessionId, username: username, connection: ws, host: true };
            }
            // Tell clients who has joined the session
            sessions[sessionId].server.clients.forEach(function (client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send("".concat(username, " has connected to session: ").concat(sessionId));
                }
            });
            ws.on("message", function (message) { return handleMessage(message, uuid); });
            ws.on("close", function () { return handleClose(uuid); });
        });
        // Upgrading socket connection to web socket
        wss_1.handleUpgrade(request, socket, head, function (ws) {
            request.url = request.url + "&sessionId=".concat(newSessionId_1);
            console.log("Connection emitted to: ".concat(request.url));
            wss_1.emit("connection", ws, request);
        });
    }
    else {
        if (!(sessionId in sessions)) {
            console.log("Session ID does not exist");
            socket.destroy();
            return;
        }
        var wss_2 = sessions[sessionId].server;
        wss_2.handleUpgrade(request, socket, head, function (ws) {
            wss_2.emit("connection", ws, request);
        });
    }
});
server.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
