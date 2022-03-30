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

// TODO - import relevant controllers/files as needed

// ripped tutorial stuff, might be malware idk
describe("how the server socket deals with received events", () => {
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

  // THESE TESTS ARE PART OF THE TUTORIAL
  // USE ONLY FOR REFERRING TO SYNTAX
  // TODO - DELETE THIS
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
  // TODO - SEE ABOVE


  // TODO - IMPLEMENT BELOW
  // Gabe: Connection, saveGame, saveText, roundEnd
  it("opens a connection", (done) => {

  });

  it("saves a game", (done) => {

  });

  it("saves text", (done) => {

  });

  it("ends a round", (done) => {

  });


  // Tim: Disconnection, joinGame, getAllGames, updateVotes, getText
  it("disconnects", (done) => {

  });

  it("joins a game", (done) => {

  });

  it("gets all games", (done) => {

  });

  it("updates votes", (done) => {

  });

  it("gets text", (done) => {

  });


  // Vicky (leader): updateGameInfo, notifyFollowers, getImage
  it("updates game info", (done) => {

  });

  it("notifies followers", (done) => {

  });

  it("gets an image", (done) => {

  });


  // David: create_game, start_game, saveImage
  it("creates a game", (done) => {

  });

  it("starts a game", (done) => {

  });

  it("saves an image", (done) => {

  });

});
