const createServer = require("http").createServer;
const Client = require("socket.io-client").io;
const Server = require("socket.io").Server;
const assert = require("chai").assert;

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
        done();
    });

    it("saves a game", (done) => {
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
        done();
    });

    it("joins a game", (done) => {
        done();
    });

    it("gets all games", (done) => {
        done();
    });

    it("updates votes", (done) => {
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
        // data needs gameID
        // optionally: numRounds, timePerRound, tags[]

        // emits joinSuccess, true; on success
        done();
    });

    it("starts a game", (done) => {
        // data needs gameID

        // emits StartGame to all users in room on success
        // emits startFailure on failure
        done();
    });

    it("saves an image", (done) => {
        // data needs image and imageID

        // doesn't emit anything on success or failure
        done();
    });

});
