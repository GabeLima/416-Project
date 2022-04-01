const createServer = require("http").createServer;
const Client = require("socket.io-client").io;
const Server = require("socket.io").Server;
const assert = require("chai").assert;

// TODO - import relevant controllers/files as needed
const sinon = require("sinon");
const mongoose = require("mongoose");
const User = require("../models/user-model");
const UserController = require("../controllers/user-controller");
const Game = require("../models/game-model");
const GameController = require("../controllers/game-controller");
const Text = require("../models/text-model");
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
    // Gabe: saveGame, saveText, roundEnd

    it("saves a game", async (done) => {
        serverSocket.on("saveGame", (data) => {
            data.gameID.should.equal("fakeGameID");
        });
        clientSocket.emit("saveGame", {gameID: "fakeGameID"});
        done();
    });

    it("saves text", (done) => {
        serverSocket.on("saveText", (data) => {
            data.text.should.equal("fakeText");
            data.textID.should.equal("fakeID");
        });
        clientSocket.emit("saveText", {text: "fakeText", textID: "fakeID"});
        done();
    });

    it("ends a round", (done) => {
        const g = {
            players: ["bob, phil, obama, mckenna, vicky, david, tim, gabe"],
            currentRound: 0,
            numRounds: 8
        }
        let startingStoryNumber = 3;
        serverSocket.on("roundEnd", (data) => {
            data.gameID.should.equal("fakeGameID");
            data.currentRound.should.equal(g.currentRound);
            g.currentRound = Math.max(data.currentRound + 1, g.currentRound);
            if(g.currentRound === g.numRounds){
                serverSocket.emit(gameEvents.GAME_OVER, g);
            }
            else{
                let newStoryNumber = (data.storyNumber + g.currentRound) % g.players.length;
                serverSocket.emit(gameEvents.START_ROUND, newStoryNumber);
            }
        });
        clientSocket.on(gameEvents.START_ROUND, (storyNumber) => {
            storyNumber.should.equal((startingStoryNumber + g.currentRound) % g.players.length);
            clientSocket.emit("roundEnd", {gameID: "fakeGameID", storyNumber: storyNumber, currentRound: g.currentRound});
        });
        clientSocket.on(gameEvents.GAME_OVER, (game) => {
            game.should.be.an("object");
            assert.deepEqual({
                players: ["bob, phil, obama, mckenna, vicky, david, tim, gabe"],
                currentRound: 8,
                numRounds: 8
            }, game);
        });
        clientSocket.emit("roundEnd", {gameID: "fakeGameID", storyNumber: startingStoryNumber, currentRound: 0});
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

        sandbox.stub(mongoose.Model, "find").returns("cooltext");

        serverSocket.on('getText', (data) => {
            const {textID} = data;
            if(!textID) {
                console.log("Error in getText, textID not provided");
                socket.emit('getText', false);
                return;
            }
            Text.findOne({textID: textID}, (err, data) => {
                serverSocket.emit("getText", "cooltext");
            });
        });

        clientSocket.on("getText", (data) => {
            data.should.equal("cooltext");
        });

        clientSocket.emit("getText", {textID: "1234"});
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
        // testing init, to be checked later
        let games = new Map();

        // function being tested (copied)
        serverSocket.on(gameEvents.CREATE_GAME, (data) => {
            if(games.has(data.gameID))
            {
                // We couldn't properly make the room due to the ID being in use or the user already being registered as in another game.
                serverSocket.emit("joinSuccess", false);
                return;
            }

            let numRounds, timePerRound;

            // TODO - enforce minimum num rounds and timeperround on client side instead of server side? that sounds like best practice.
            if (!data.numRounds) {
                numRounds = gameRules.DEFAULT_NUM_ROUNDS;
            }
            else {
                numRounds = data.numRounds;
            }

            if (!data.timePerRound) {
                timePerRound = gameRules.DEFAULT_TIME_PER_ROUND;
            }
            else {
                timePerRound = data.timePerRound;
            }

            //Checking tags
            let tags = [];
            if (data.tags)
            {
                tags = data.tags;
            }

            const gameInfo = {
                gameID: data.gameID,
                players: [data.email],
                creator: data.email,
                gameStatus: gameStatus.LOBBY,
                playerVotes: [[]],
                numRounds: numRounds,
                timePerRound: timePerRound,
                currentRound: 0,
                tags: tags
            };
            //Map uses set instead of push
            games.set(data.gameID, gameInfo);
            
            // replaced for 
            // joinGame(serverSocket, data, gameInfo);
            serverSocket.emit("joinSuccess", true);
        });

        // execute the test
        clientSocket.emit(gameEvents.CREATE_GAME, {
            gameID: "XYZ",
            email: "a",
            numRounds: 5,
            timePerRound: 10,
            tags: []
        });

        // verifying test is correct
        clientSocket.on("joinSuccess", (data) => {
            data.should.equal(true);
            // checking the changed live_game value
            assert.deepEqual( {
                gameID: "XYZ",
                players: ["a"],
                gameStatus: gameStatus.LOBBY,
                playerVotes: [[]],
                creator: "a",
                numRounds: 5,
                timePerRound: 10,
                currentRound: 0,
                tags: []
            }, games.get("XYZ"));
        });
        
        done();
    });

    it("starts a game", (done) => {
        // testing init, to be used in the function
        let games = new Map();
        let panels = new Map();
        games.set("ABC", {
            gameID: "ABC",
            players: ["a"],
            gameStatus: gameStatus.LOBBY,
            playerVotes: [["nobody"], [], [], []],
            creator: "a",
            numRounds: 5,
            timePerRound: 10,
            currentRound: 0,
            tags: [],
            panels: panels
        });

        // function being tested (copied)
        serverSocket.on(gameEvents.START_GAME, (data) => {
            if(games.has(data.gameID))
            {
                let g = games.get(data.gameID);
                if(g.gameStatus === gameStatus.LOBBY)
                {
                    g.gameStatus = gameStatus.PLAYING;
                    //We're going to be tracking the playerPanels throughout the game
                    g.panels = new Map();
                    for(let i = 0; i < g.players.length; i++){ // changed to i
                        //Fill in every storyNumber with an empty array to represent the story
                        g.panels.set(i, []); // change to set
                    }

                    // startGame(io, g); Not trying to test the timing here
                    // The emitting line is copied from startGame()
                    // Tell the users that the game is starting.
                    serverSocket.emit(gameEvents.START_GAME);
                    return;
                }
            }

            serverSocket.emit("startFailure");
        });

        // executing the test
        clientSocket.emit(gameEvents.START_GAME, {
            gameID: "ABC"
        });

        // verifying test is corect
        clientSocket.on(gameEvents.START_GAME, () => {
            // reaching this is a success, there is no return data
            let newPanels = new Map();
            newPanels.set(0, []);
            assert.deepEqual({
                gameID: "ABC",
                players: ["a"],
                gameStatus: gameStatus.PLAYING,
                playerVotes: [["nobody"], [], [], []],
                creator: "a",
                numRounds: 5,
                timePerRound: 10,
                currentRound: 0,
                tags: [],
                panels: newPanels
            }, games.get("ABC"));
        });

        done();
    });

    it("saves an image", (done) => {
        // function to be tested (copied)
        // I added the emits for testing
        serverSocket.on('saveImage', (data) => {
            if(!data.image || !data.imageID)
            {
                //console.log("The necessary parameters for saving the image was not provided.");
                serverSocket.emit('saveImage', false);
                return;
            }

            //console.log("Image received");
            //console.log(data.imageID + " : " + data.image);

            // would normally save here but replaced with emits
            serverSocket.emit('saveImage', true);
        });

        // runs the test
        const asciiBuf = Buffer.alloc(5, 'a', 'ascii');
        clientSocket.emit('saveImage', {
            image: asciiBuf,
            imageID: "fakeID"
        })

        // doesn't emit anything on success or failure
        // so I can't verify if the test passed
        // I added emits for testing
        clientSocket.on('saveImage', (data) => {
            data.should.equal(true);
        })

        done();
    });

});
