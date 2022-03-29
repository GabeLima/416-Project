const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const fs = require("fs");

const Games = require("./models/game-model");
const Images = require("./models/image-model");
const Users = require("./models/user-model.js");

const socketWrapper = require('./socketWrapper.js');
import {gameEvents, gameRules, gameStatus }from "./constants.js";

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*"
    },
});
//Array of objects of clientInfo
// const clientInfo = {
//     email: data.email,
//     clientId: socket.id,
// };
var clients =[];
//Array of objects of gameInfo
// const gameInfo = {
//     gameID: "",
//     players: [],
//     gameStatus: gameStatus.STATUS,
//     playerVotes: [[]],
//     creator: "",
//     numRounds: data.numRounds,
//     timePerRound: data.timePerRound,
//     currentRound: 0
// };
var games = [];



io.on('connection', function (socket) {
    console.log("a user CONNECTED.");

    socket.on('storeClientInfo', function (data) {
        const clientInfo = {
            email: data.email,
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
            creator: data.email,
            gameStatus: gameStatus.LOBBY,
            playerVotes: [[]],
            numRounds: numRounds,
            timePerRound: timePerRound,
            currentRound: 0
        };
        games.push(gameInfo);
        
        socketWrapper.joinGame(socket, data, gameInfo);
        
        
    });


    socket.on(gameEvents.START_GAME, (data) => {
        for (const g of games) {
            if (g.gameStatus === gameStatus.LOBBY && g.gameID === data.gameID) {
                socketWrapper.startGame(io, g);
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
                g.players.push(data.email);

                socketWrapper.joinGame(socket, data, g);
            }
        }
        //Joining the game failed
        socket.emit("joinSuccess", false);
        console.log("The user with email:" + data.email + " failed to join the game:" + data.gameID);
    });


    /*
        Returns the list of games that can be joined.
    */
    socket.on('getAllGames', function (data) {
        console.log("The user with email:" + data.email + " failed to join the game:" + data.gameID);
        let lobbyGames = games.filter(game => game.gameStatus === gameStatus.LOBBY)
        socket.emit("gameList", lobbyGames);
    });

    /*
        Notifies Followers that a game has been created
    */
    socket.on('notifyFollowers', function(data) {
        // get a list of followed users from the database
        const email = data.email;
        Users.findOne({email: email}, (err, data) => {
            if(err || !data) {
                console.log("Error in notifyFollowers: " + err);
                socket.emit('notifyFollowers', false);
            }
            else {
                // reduce the clients list to those who follow this user
                let followers = data.followers; // list of emails I assume?
                const online_followers = clients.filter(client => followers.includes(client.email));

                // notify every online follower
                online_followers.forEach( (follower) => {
                    /* 
                        Currently there's no way to know what the gameID is
                        if we want to include the gameID 
                        either include the gameID as a paramater to this function
                        or add a creator field to the games list
                    */
                    io.to(follower.clientId).emit("newGameNotification", email + " has started a game!", data.gameID);
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
        Images.findOne({imageID: imgID}, (err, data) => {
            if(err) {
                console.log("Error in getImage: " + err);
                socket.emit('getImage', false);
            }
            else {
                socket.emit('getImage', data.image);
            }
        });
    });

    /*
        Updates the playerVotes field for a game 
        Deletes previous vote if present then adds a new vote
        inputs:
            gameID, email, storyNumber
    */
    socket.on('updateVotes', function(data) {
        // get game data from db
        const {gameID, email, storyNumber} = data;
        Games.findOne({gameID: gameID}, (err, data) => {
            if(err || !data) {
                console.log("Error in updateVotes: " + err);
                socket.emit("updateVotes", false);
            }
            else {
                // remove vote if already present
                for(var i=0; i<data.playerVotes.length; i++) {
                    let removeIndex = data.playerVotes[i].findIndex(email);
                    if(removeIndex > -1) {
                        data.playerVotes.splice(removeIndex, 1);
                        break;
                    }
                }

                // add new vote
                data.playerVotes[storyNumber].push(email);

                // apply changes
                data.save();
                socket.emit("updateVotes", true);
            }
        });
    });

    /*
        Uploading the image that was received from the message (saving it to the database)
    */
   socket.on('saveImage', async (data) => {
       //data.imageID = gameID + storyNumber(different stories) + roundNumber(panel number of story)
       if(!data.image || !data.imageID)
       {
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

       console.log(savedImage.imageID + " was successfully saved.")

       /*
        Are we going to handle send the image to the next random person here?
        TODO: choosing a random person if not end of next round
       */
   });

   socket.on('roundEnd', function(data) {
    const {gameID, storyNumber, email} = data;
    const g = games.get(data.gameID);
    //Add the imageID to every story
    g.panels.get(storyNumber).push("" + data.gameID + data.storyNumber + g.currentRound);
    //Need to manage concurrency in the following:
    

    //After the 1/2 second timer, if we are missing images, we fill in their expected image with some blank image
    setTimeout(() => {
        for(const panel of g.panels){
            if(panel.length < roundNumber + 1){
                panel.push("" + 0); //imageID 0 will represent a blank image
            }
        }
        
    }, 500);

    //Call client round end, which will call saveImage and this function again (if the game isn't over)
    setTimeout(() => {
        io.to(g.gameID).emit(gameEvents.ROUND_END);
    }, g.timePerRound * 1000);
});





});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
