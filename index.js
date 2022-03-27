
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const fs = require("fs");
const Games = require("../models/game-model");
const Images = require("../models/image-model");
const Users = require("../models/user-model.js");

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
        Notifies Followers that a game has been created
    */
    socket.on('notifyFollowers', function(data) {
        // get a list of followed users from the database
        const userEmail = data.userEmail;
        Users.find({email: userEmail}, (err, data) => {
            if(err || !data) {
                console.log("Error in notifyFollowers: " + err);
                socket.emit('notifyFollowers', false);
            }
            else {
                // reduce the clients list to those who follow this user
                let followers = data.followers; // list of emails I assume?
                const online_followers = clients.filter(client => followers.includes(client.userEmail));

                // notify every online follower
                online_followers.forEach( (follower) => {
                    /* 
                        Currently there's no way to know what the gameID is
                        if we want to include the gameID 
                        either include the gameID as a paramater to this function
                        or add a creator field to the games list
                    */
                    io.to(follower.clientId).emit("newGameNotification", userEmail + " has started a game!");
                });
                socket.emit("notifyFollowers", true);
            }
        });
    });

    /*
        Returns an image from the database
        TODO: 
            Using roundNumber?
            Figure out how to return properly
    */
    socket.on('getImage', function(data) {
        // get imgID from gameID and storyNumber
        const {gameID, storyNumber, roundNumber} = data;
        Games.findOne({gameID: gameID}, (err, data) => {
            if(err || !data) {
                console.log("Error in getImage: " + err);
                socket.emit('getImage', false);
            }
            else {
                // get image from imgID
                let imgID = data.panels[storyNumber];
                Images.findOne({imageID: imgID}, (err, data) => {
                    if(err) {
                        console.log("Error in getImage: " + err);
                        socket.emit('getImage', false);
                    }
                    else {
                        socket.emit('getImage', data.image);
                    }
                });
            }
        });
    });

    /*
        Updates the playerVotes field for a game 
        Deletes previous vote if present then adds a new vote
        inputs:
            gameID, userEmail, storyNumber
    */
    socket.on('updateVotes', function(data) {
        // get game data from db
        const {gameID, userEmail, storyNumber} = data;
        Games.findOne({gameID: gameID}, (err, data) => {
            if(err || !data) {
                console.log("Error in updateVotes: " + err);
                socket.emit("updateVotes", false);
            }
            else {
                // remove vote if already present
                for(var i=0; i<data.playerVotes.length; i++) {
                    let removeIndex = data.playerVotes[i].findIndex(userEmail);
                    if(removeIndex > -1) {
                        data.playerVotes.splice(removeIndex, 1);
                        break;
                    }
                }

                // add new vote
                data.playerVotes[storyNumber].push(userEmail);

                // apply changes
                data.save();
                socket.emit("updateVotes", true);
            }
        });
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
