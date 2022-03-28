const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const fs = require("fs");
const Image = require('./server/models/image-model')

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*"
    },
});
//Array of objects of clientInfo
// const clientInfo = {
//     userEmail: data.userEmail,
//     clientId: socket.id,
// };
var clients =[];
//Array of objects of gameInfo
// const gameInfo = {
//     gameID: "",
//     players: [],
//     gameStatus: gameStatus.STATUS,
//     numRounds: data.numRounds,
//     timePerRound: data.timePerRound,
//     currentRound: 0
// };
var games = [];



io.on('connection', function (socket) {
    console.log("a user CONNECTED.");

    socket.on('storeClientInfo', function (data) {
        const clientInfo = {
            userEmail: data.userEmail,
            clientId: socket.id,
        };
        clients.push(clientInfo);
    });

    /*
        When a user disconnects, we remove their socket from the clients[].
        We also have to check if they we're part of any existing games, and if so, remove them
        and tell the other people in the game that they've left @DAVID.
    */
    socket.on('disconnect', function (data) {
        console.log("A user DISCONNECTED.");
        //remove the users from the clients[]
        for(var i = 0; i < clients.length ; i++){
            var c = clients[i];
            if(c.clientId == socket.id){
                clients.splice(i,1);
                break;
            }
        }
    });

    /*
        When we create a game we'll have to create proper game session in our games variable. Their display will also
        switch to the game lobby.
    */
    socket.on(gameEvents.CREATE_GAME, (data) => {

        for (const g of games) {
            if (g.gameID === data.gameID || g.players.includes(data.email)) {
                // We couldn't properly make the room due to the ID being in use or the user already being registered as in another game.
                console.log("User " + data.email + " tried to make a room with ID " + data.gameID + " unsuccessfully.");
                socket.emit("joinSuccess", false);
                return;
            }
        };

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
            timePerRound = data.timePerRound
        }
        const gameInfo = {
            gameID: data.gameID,
            players: [data.email],
            gameStatus: gameStatus.LOBBY,
            numRounds: numRounds,
            timePerRound: timePerRound,
            currentRound: 0
        };

        games.push(gameInfo);
        socket.join(data.gameID);

        socket.emit("joinSuccess", true); 

        console.log("Game with ID " + data.gameID + " was created by: " + clients[i].email);
        
    });


    socket.on(gameEvents.START_GAME, (data) => {
        for (const g of games) {
            if (g.gameStatus === gameStatus.LOBBY && g.gameID === data.gameID) {
                g.gameStatus = gameStatus.PLAYING;

                // Tell the users that the game is starting.
                io.to(g.gameID).emit(gameEvents.START_GAME);

                // We'll be storing timePerRound as seconds, so we need to multiply accordingly to reach ms.
                setTimeout(() => {
                    io.to(g.gameID).emit(gameEvents.ROUND_END);
                }, g.timePerRound * 1000);
                return;
            }
        }

        io.to(g.gameID).emit("startFailure");
        console.log("The game with ID " + data.gameID + " could not be successfully started.");
    });


    /*
        When a player joins a game, they'll notify other players in that game they're joining,
        and their display will switch to the game lobby.
    */
    socket.on('joinGame', function (data) {
        for(var i=0; i < games.length; i++){
            var g = games[i];
            if(g.gameStatus === gameStatus.LOBBY && g.gameID === data.gameID && g.players.length < gameRules.PLAYERLIMIT){

                //Add their data to the game
                g.players.push(data.userEmail);
                socket.join(g.gameID);

                //Tell other users that a new player is joining
                socket.to(g.gameID).emit(gameEvents.JOINING_GAME, data.userName);

                //Tell the user joining they can switch to the game-lobby
                socket.emit("joinSuccess", true);
                console.log("The user with email:" + data.userEmail + " joined the game:" + data.gameID);
                return;
            }
        }
        //Joining the game failed
        socket.emit("joinSuccess", false);
        console.log("The user with email:" + data.userEmail + " failed to join the game:" + data.gameID);
    });


    /*
        Returns the list of games that can be joined.
    */
    socket.on('getAllGames', function (data) {
        console.log("The user with email:" + data.userEmail + " failed to join the game:" + data.gameID);
        let lobbyGames = games.filter(game => game.gameStatus === gameStatus.LOBBY)
        socket.emit("gameList", lobbyGames);
    });

    /*
        Uploading the image that was received from the message (saving it to the database)
    */
   socket.on('saveImage', async (data) => {
       //data.imageID = gameID + storyNumber(different stories) + roundNumber(panel number of story)
       if(!data.image || !data.imageID)
       {
            socket.to(data.gameID).emit("saveSuccess", false);              //Only tells room if image is saved, cause no one else would care
            console.log("The necessary parameters for saving the image was not provided.");
            return;
       }

       console.log("Image received");
       console.log(data.imageID + " : " + data.image);

       const imageData = new Image({
           image: data.image,
           imageID: data.imageID
       });

       savedImage = await imageData.save();

       socket.to(data.gameID).emit("saveSuccess", true)
       console.log(savedImage.imageID + " was successfully saved.")

       /*
        Are we going to handle send the image to the next random person here?
        TODO: choosing a random person if not end of next round
       */
   })


});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
