const createServer = require("http").createServer;
const Client = require("socket.io-client").io;
const Server = require("socket.io").Server;
const assert = require("chai").assert;

// TODO - import relevant controllers/files as needed
const sinon = require("sinon");
const mongoose = require("mongoose");
const UserModel = require("../models/user-model");
const UserController = require("../controllers/user-controller");
const GameModel = require("../models/game-model");
const GameController = require("../controllers/game-controller");
const socketWrapper = require("../socketWrapper.js");
const {gameEvents, gameRules, gameStatus, images} = require("../constants");


let sandbox = sinon.createSandbox();
// ripped tutorial stuff, might be malware idk
describe("how the server socket deals with received events", () => {
    let io, serverSocket, clientSocket, res;

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

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        res = {
            json: sandbox.spy(),
            status: sandbox.stub().returns({end: sandbox.spy()})
        };
    });
  
    afterEach(() => {
        sandbox.restore();
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

        // TODO - I uh... Don't think we need to do this. It's already part of the before() setup.
        done();
    });

    it("saves a game", async (done) => {
        done();
    });

    it("saves text", (done) => {
        done();
    });

    it("ends a round", (done) => {
        done();
    });


    // Tim: Disconnection, joinGame, getAllGames, updateVotes, getText
    it("disconnects", (done) => {

        // TODO - same case as checking for connect.
        done();
    });

    it("joins a game", (done) => {
        serverSocket.on("joinGame", (data) => {
            serverSocket.emit("joinSuccess", true);
        });

        clientSocket.on("joinSuccess", (data) => {
            data.should.equal(true);
        });

        clientSocket.emit("joinGame");

        done();
    });

    it("gets all games", (done) => {
        serverSocket.on("getAllGames", (data) => {
            let lobbyGames = [];
            lobbyGames.push({
                gameID: "ABC",
                players: ["a"],
                gameStatus: gameStatus.LOBBY,
                playerVotes: [[]],
                creator: "a",
                numRounds: 5,
                timePerRound: 10,
                currentRound: 0,
                tags: []
            });
            serverSocket.emit("gameList", lobbyGames);
        });

        clientSocket.on("gameList", (data) => {
            data.should.be.an("array");
            data.should.have.lengthOf(1);

            let g = data[0];

            g.should.be.an("object");
            assert.deepEqual({
                gameID: "ABC",
                players: ["a"],
                gameStatus: gameStatus.LOBBY,
                playerVotes: [[]],
                creator: "a",
                numRounds: 5,
                timePerRound: 10,
                currentRound: 0,
                tags: []
            }, g);

        });
        clientSocket.emit("getAllGames");
        done();
    });


    it("updates votes with a new vote from the user", (done) => {

        serverSocket.once("updateVotes", (data) => {
            const {gameID, email, storyNumber} = data;

            let games = new Map();
            games.set("ABC", {
                gameID: "ABC",
                players: ["a"],
                gameStatus: gameStatus.LOBBY,
                playerVotes: [["nobody"], [], [], []],
                creator: "a",
                numRounds: 5,
                timePerRound: 10,
                currentRound: 0,
                tags: []
            });

            if(!gameID || !email || !storyNumber || !games.has(gameID)) {
                serverSocket.emit('updateVotes', false);
                console.log("Error in updateVotes, missing paramaters");
                return;
            }

            // remove user from votes if already present
            for(let i=0; i<games.get(gameID).playerVotes.length; i++) {
                let r = games.get(gameID).playerVotes[i].indexOf(email);
                if(r > -1) {
                    games.get(gameID).playerVotes[i].splice(r, 1);
                    break;
                }
            }

            // add vote
            games.get(gameID).playerVotes[storyNumber].push(email);
            serverSocket.emit("updateVotes", true, games.get(gameID));
        });

        clientSocket.once("updateVotes", (success, game) => {
            success.should.equal(true);
            
            game.should.be.an("object");
            assert.deepEqual({
                gameID: 'ABC',
                players: [ 'a' ],
                gameStatus: gameStatus.LOBBY,
                playerVotes: [ [ 'nobody' ], [], [ 'ok@gmail.com' ], [] ],
                creator: 'a',
                numRounds: 5,
                timePerRound: 10,
                currentRound: 0,
                tags: []
              }, game);
        });

        clientSocket.emit("updateVotes", {gameID: "ABC", email: "ok@gmail.com", storyNumber: 2 });

        done();
    });

    
    it("updates votes with an existing vote by the user", (done) => {
        serverSocket.once("updateVotes", (data) => {
            const {gameID, email, storyNumber} = data;

            let games = new Map();
            games.set("XYZ", {
                gameID: "XYZ",
                players: ["a"],
                gameStatus: gameStatus.LOBBY,
                playerVotes: [["nobody"], [], ["ok@gmail.com"], []],
                creator: "a",
                numRounds: 5,
                timePerRound: 10,
                currentRound: 0,
                tags: []
            });

            // remove user from votes if already present
            for(let i=0; i<games.get(gameID).playerVotes.length; i++) {
                let r = games.get(gameID).playerVotes[i].indexOf(email);
                if(r > -1) {
                    games.get(gameID).playerVotes[i].splice(r, 1);
                    break;
                }
            }
            // add vote
            games.get(gameID).playerVotes[storyNumber].push(email);
            serverSocket.emit("updateVotes", true, games.get(gameID));
        });

        clientSocket.once("updateVotes", (success, game) => {
            success.should.equal(true);
            game.should.be.an("object");
            assert.deepEqual({
                gameID: 'XYZ',
                players: [ 'a' ],
                gameStatus: 'lobby',
                playerVotes: [ [ 'nobody', "ok@gmail.com" ], [], [], [] ],
                creator: 'a',
                numRounds: 5,
                timePerRound: 10,
                currentRound: 0,
                tags: []
              }, game);
        });

        clientSocket.emit("updateVotes", {gameID: "XYZ", email: "ok@gmail.com", storyNumber: 0 });

        done();
    });


    // TODO - do we need this? we can easily prevent this from happening client-side.
    it("votes on the same thing again.", (done) => {
        serverSocket.once("updateVotes", (data) => {
            const {gameID, email, storyNumber} = data;
            
            let games = new Map();
            games.set("XYZ", {
                gameID: "XYZ",
                players: ["a"],
                gameStatus: gameStatus.LOBBY,
                playerVotes: [["nobody"], [], ["ok@gmail.com"], []],
                creator: "a",
                numRounds: 5,
                timePerRound: 10,
                currentRound: 0,
                tags: []
            });

            if(!gameID || !email || !storyNumber || !games.has(gameID)) {
                serverSocket.emit('updateVotes', false);
                console.log("Error in updateVotes, missing paramaters");
                return;
            }
            // remove user from votes if already present
            for(let i=0; i<games.get(gameID).playerVotes.length; i++) {
                let r = games.get(gameID).playerVotes[i].indexOf(email);
                if(r > -1) {
                    games.get(gameID).playerVotes[i].splice(r, 1);
                    break;
                }
            }
            // add vote
            games.get(gameID).playerVotes[storyNumber].push(email);
            serverSocket.emit("updateVotes", true, games.get(gameID));
        });

        clientSocket.once("updateVotes", (success, game) => {
            success.should.equal(true);
            game.should.be.an("object");
            assert.deepEqual({
                gameID: 'XYZ',
                players: [ 'a' ],
                gameStatus: 'lobby',
                playerVotes: [ [ 'nobody' ], [], ["ok@gmail.com"], [] ],
                creator: 'a',
                numRounds: 5,
                timePerRound: 10,
                currentRound: 0,
                tags: []
              }, game);
        });

        clientSocket.emit("updateVotes", {gameID: "XYZ", email: "ok@gmail.com", storyNumber: 2 });

        done();
    });


    it("gets text", (done) => {
        done();
    });


    // Vicky (leader): updateGameInfo, notifyFollowers, getImage
    it("updates game info", (done) => {
        done();
    });

    it("notifies followers", (done) => {
        done();
    });

    it("gets an image", (done) => {
        done();
    });


    // David: create_game, start_game, saveImage
    it("creates a game", (done) => {
        done();
    });

    it("starts a game", (done) => {
        done();
    });

    it("saves an image", (done) => {
        done();
    });

});
