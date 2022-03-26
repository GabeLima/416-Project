const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const fs = require("fs");

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
            if (g.gameID === data.gameID || g.players.includes(data.userEmail)) {
                // We couldn't properly make the room due to the ID being in use or the user already being registered as in another game.
                console.log("User " + data.userEmail + " tried to make a room with ID " + data.gameID + " unsuccessfully.");
                socket.emit("createSuccess", false);
                return;
            }
        };

        const gameInfo = {
            gameID: data.gameID,
            players: [data.userEmail],
            gameStatus: gameStatus.LOBBY
        };
        games.push(gameInfo);
        socket.join(data.gameID);

        // TODO - can we actually re-use the joinSuccess in joinGame to do this? Both serve the purpose of telling a user if they can join a room.
        socket.emit("createSuccess", true); 

        console.log("Game with ID " + data.gameID + " was created by: " + clients[i].userEmail);
        
    });


    socket.on(gameEvents.START_GAME, (data) => {
        for (const g of games) {
            if (g.gameStatus === gameStatus.LOBBY && g.gameID === data.gameID && g.players.length < gameRules.PLAYERLIMIT) {
                g.gameStatus = gameStatus.PLAYING;

                // Tell the users that the game is starting.
                io.to(g.gameID).emit("GameBeginning");
                return;
            }
        }
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
        socket.emit({
            success: true,
            games: lobbyGames
        });
    });


});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
