// ripped from socket tutorial
// with { "type": "module" } in your package.json
import { createServer } from "http";
import { io as Client } from "socket.io-client";
import { Server } from "socket.io";
import { assert } from "chai";

// with { "type": "commonjs" } in your package.json
// const { createServer } = require("http");
// const { Server } = require("socket.io");
// const Client = require("socket.io-client");
// const assert = require("chai").assert;

// Gabe: Connection, saveGame, saveText, roundEnd

// Tim: Disconnection, joinGame, getAllGames, updateVotes, getText

// Vicky (leader): updateGameInfo, notifyFollowers, getImage

// David: create_game, start_game, saveImage
describe("", () => {

});

// ripped tutorial stuff, might be malware idk
describe("create", () => {
  let io, serverSocket, clientSocket;

  before((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  after(() => {
    io.close();
    clientSocket.close();
  });

  it("should work", (done) => {
    clientSocket.on("hello", (arg) => {
      assert.equal(arg, "world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  it("should work (with ack)", (done) => {
    serverSocket.on("hi", (cb) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg) => {
      assert.equal(arg, "hola");
      done();
    });
  });
});
