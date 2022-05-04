const http = require('http');
const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const fs = require("fs");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require("path");

const Games = require("./models/game-model");
const Images = require("./models/image-model");
const Texts = require("./models/text-model");
const Users = require("./models/user-model.js");
const {gameEvents, gameRules, gameStatus, gameFailure} = require("./constants");
const {joinGame, startGame} = require("./socketWrapper");

dotenv.config();
const app = express();
// SETUP THE MIDDLEWARE
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    //origin: "http://localhost:3000", //LOCAL DEPLOYMENT
    origin: "https://derit.herokuapp.com/", //HEROKU DEPLOYMENT
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
const router = require('./routes/router')
app.use('/api', router)

// INITIALIZE OUR DATABASE OBJECT
const db = require('./db');
const { strictEqual } = require('assert');
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

//HEROKU, COMMENT OUT STEP 1 AND 2 IF YOU'RE BUILDING LOCALLY
// Step 1:
app.use(express.static(path.resolve(__dirname, "./client/build")));
// // Step 2:
app.get("*", function (request, response) {
   response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
 });

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
//     isComic: true
//     gameID: "",
//     players: [],
//     gameStatus: gameStatus.STATUS,
//     playerVotes: [[]],
//     creator: "",
//     numRounds: data.numRounds,
//     timePerRound: data.timePerRound,
//     currentRound: 0,
//     tags: [],
// };
/*
    Changing games to a map
    gameID : gameInfo
*/
var games = new Map();



io.on('connect', function (socket) {
    console.log("a user CONNECTED.");

    socket.on('storeClientInfo', function (data) {

        
        // edge case: the user re-uses the same socket connection but logs out and logs in.
        // We'll end up adding a new entry for their socket ID, so we need to account for that.
        for (let i = 0; i < clients.length; i++) {
            if (socket.id === clients[i].clientId) {
                if (data.email === clients[i].email) {
                    // logged back into same account, do nothing
                    console.log("User reused socket & account, not updating client info");
                    return;
                }
                else {
                    // logged into DIFFERENT account, change entry.
                    console.log("User reused socket with DIFFERENT email, updaying client info");
                    clients[i].email = data.email;
                    return;
                }
            }
        }

        console.log('storing new client info');
        console.log(data);
        console.log(socket.id);

        const clientInfo = {
            email: data.email,
            clientId: socket.id,
        };
        clients.push(clientInfo);
        console.log("Client list:");
        console.log(clients);
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
        console.log("Inside create game!");
        if(games.has(data.gameID))
        {
            // We couldn't properly make the room due to the ID being in use or the user already being registered as in another game.
            console.log("User " + data.email + " tried to make a room with ID " + data.gameID + " unsuccessfully.");
            socket.emit("joinSuccess", {value:false});
            return;
        }

        let numRounds, timePerRound;

        numRounds = data.numRounds;


        timePerRound = data.timePerRound;


        //Checking tags
        let tags = [];
        if (data.tags)
        {
            tags = data.tags;
        }

        const gameInfo = {
            isComic: data.isComic,
            gameID: data.gameID,
            players: [data.username],
            creator: data.username,
            gameStatus: gameStatus.LOBBY,
            playerVotes: [[]],
            numRounds: numRounds,
            timePerRound: timePerRound,
            currentRound: 0,
            tags: tags,
        };
        //Map uses set instead of push
        games.set(data.gameID, gameInfo);
        console.log("Creating the game worked! Telling user to join game");
        console.log(gameInfo);
        joinGame(socket, data, gameInfo);
        //Tell the user joining they can switch to the game-lobby
        socket.emit("joinSuccess", {value:true, gameID:data.gameID, username:data.username, email:data.email, gameInfo: gameInfo});
        
    });


    socket.on(gameEvents.START_GAME, (data) => {
        if(games.has(data.gameID))
        {
            let g = games.get(data.gameID);
            if(g.gameStatus === gameStatus.LOBBY)
            {
                g.gameStatus = gameStatus.PLAYING;
                //We're going to be tracking the playerPanels throughout the game
                g.panels = new Map();
                for(let i = 0; i < g.players.length; i++){
                    //Fill in every storyNumber with an empty array to represent the story
                    g.panels.set(i, []);
                }
                //console.log("Game after adding panels: ", g);
                //console.log(games.get(data.gameID));

                startGame(io, g);
                return;
            }
        }

        io.to(data.gameID).emit("startFailure");
        console.log("The game with ID " + data.gameID + " could not be successfully started.");
    });


    /*
        When a player joins a game, they'll notify other players in that game they're joining,
        and their display will switch to the game lobby.
    */
    socket.on('joinGame', function (data) {
        if(games.has(data.gameID))
        {
            let g = games.get(data.gameID);
            if (g.players.includes(data.username)) {
                return;
            }

            if(g.gameStatus === gameStatus.LOBBY && g.players.length < gameRules.PLAYER_LIMIT)
            {
                //Add their data to the game and updating the map
                g.players.push(data.username);
                console.log("The user with username:" + data.username + " joined the game:" + data.gameID);
                joinGame(socket, data, g);
                //Tell the user joining they can switch to the game-lobby
                socket.emit("joinSuccess", {value:true, gameID:data.gameID, username:data.username, gameInfo: g});
                console.log("Telling user they can join the game lobby!");
                console.log(g);
                return;
            }
        }

        //Joining the game failed
        socket.emit("joinSuccess", {value:false});
        console.log("The user with username:" + data.username + " failed to join the game:" + data.gameID);
    });

    socket.on("playerLeftLobby", (data) => {
        const { gameID, username } = data;
        if (games.has(gameID)) {
            let game = games.get(gameID);
            console.log("Removing " + username + " from game lobby");
            game.players.splice(game.players.indexOf(username), 1);

            if (game.creator === username) {
                // promote next person in line
                game.creator = game.players[0];
            }
            //Tell other users that the player list changed. we can ignore the socket that sent this event since the dude's gone anyways.
            socket.to(game.gameID).emit("playerLeftLobby", { gameInfo: game});
            console.log(game);
            console.log(games);
        }
    });
    
    socket.on("deleteEmptyLobby", (data) => {
        const gameID = data.gameID;
        if (games.has(gameID)) {
            console.log("Deleting game " + gameID);
            games.delete(gameID);
        }
    });

    /*
        Updating the live game data in the games map
        Called by a player when they want to give new information
        gameID, players (set by createGame/join game), gameStatus (governed by other functions)
        numRounds (decided by createGame), timePerRound (decided by createGame)

        Changes that can be done by function:
        playerVotes, currentRound
    */
    socket.on('updateGameInfo', (data) => {
        if(!data.gameID)
        {
            console.log("There is no gameID provided so there is no way to update a game.")
        }

        let g = games.get(data.gameID);

        //Based off David's updateVote but for the live data in gameInfo, David should change updateVotes
        //To just take the live data and store it instead
        if(data.vote != undefined)                   //Player submited a vote
        {
            //Remove vote if already present
            for(let i = 0; i < g.playerVotes.length; i++)
            {
                let removedI = g.playerVotes[i].indexOf(data.username);
                if(removedI > -1)
                {
                    g.playerVotes[i].splice(removedI, 1);
                    break;
                }
            }

            //Adds the vote to the 
            g.playerVotes[data.vote].push(data.username);
        }

        //Updating number of rounds
        if(data.numRounds != undefined)
        {
            g.numRounds = data.numRounds;
        }

        //Updating the time per round
        if(data.timePerRound != undefined)
        {
            g.timePerRound = data.timePerRound;
        }

        //Updating tags
        if(data.tags != undefined)
        {
            g.tags = data.tags;
        }

        console.log(g.gameID + "'s information has been updated.");
        io.to(g.gameID).emit('updateGameInfo', g);
    });

    /*
        Returns the list of games that can be joined.
    */
    socket.on('getAllGames', function (data) {
        //let lobbyGames = games.filter(game => game.gameStatus === gameStatus.LOBBY)
        let lobbyGames = [];
        for (let gInfo of games.values()){
            if(gInfo.gameStatus === gameStatus.LOBBY)                                   //Gets games that are still in lobby state
            {
                lobbyGames.push(gInfo);
            }
        }
        socket.emit("gameList", lobbyGames);
    });

    /*
        Notifies Followers that a game has been created
    */
    socket.on('notifyFollowers', function(data) {
        console.log("Inside notifyFollowers!", data);
        // get a list of followed users from the database
        const {email, gameID} = data;
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
                    io.to(follower.clientId).emit("newGameNotification", {email: email, gameID: gameID});
                });
                socket.emit("notifyFollowers", true);
            }
        });
    });

    /*
        Returns an image from the database
    */
    socket.on('getImage', function(data) {
        // get imgID from gameID and storyNumber
        try{
            const {gameID, storyNumber} = data;
            let imageID = data.imageID;
            console.log("Inside getImage!", data);
            if(gameID !== undefined && storyNumber!== undefined){
                const g = games.get(gameID);
                let panel = g.panels.get(storyNumber);
                console.log("Panel: ", panel);
                while(panel.length < g.currentRound){
                    panel.push(gameFailure.BLANK_IMAGE_ID);
                }
                console.log("Panel: ", panel);
                imageID = panel[panel.length - 1];
            }
            else if(imageID === undefined || imageID === null){
                console.log("Error on getImage, missing data from the payload: ", data);
                return;
            }
            console.log("Searching for imageID: ", imageID);
            Images.findOne({imageID: imageID}, (err, data) => {
                if(err ||!data) {
                    console.log("Error in getImage: " + err);
                    socket.emit('getImage', gameFailure.BLANK_IMAGE_ID);
                }
                else {
                    socket.emit('getImage', data.image.toString());
                }
            });
        }
        catch{
            console.log("Exception in getImage");
        }
    });

    /*
        Returns text from the database
    */
    // socket.on('getText', function(data) {
    //     // get imgID from gameID and storyNumber
    //     const {gameID, storyNumber} = data;
    //     let textID = data.textID;
    //     if(!textID && !(gameID && storyNumber)){
    //         console.log("Error on getText, missing data from the payload: ", data);
    //         socket.emit('getText', false);
    //         return;
    //     }
    //     if(gameID && storyNumber){
    //         const g = games.get(gameID);
    //         if(g){
    //             let panel = g.panels.get(storyNumber);
    //             while(panel.length < g.currentRound){
    //                 panel.push(gameFailure.BLANK_TEXT_ID);
    //             }
    //             textID = panel[panel.length - 1];
    //         }
    //     }
    //     Texts.findOne({textID: textID}, (err, data) => {
    //         if(err || !data) {
    //             console.log("Error in getText " + err);
    //             socket.emit('getText', gameFailure.BLANK_TEXT_ID);
    //         }
    //         else {
    //             socket.emit('getText', data.text);
    //         }
    //     });
    // });
    socket.on('getText', function(data) {
        // get imgID from gameID and storyNumber
        try{
            const {gameID, storyNumber} = data;
            let textID = data.textID;
            console.log("Inside getText!", data);
            if(gameID !== undefined && storyNumber!== undefined){
                const g = games.get(gameID);
                let panel = g.panels.get(storyNumber);
                console.log("Panel: ", panel);
                while(panel.length < g.currentRound){
                    panel.push(gameFailure.BLANK_TEXT_ID);
                }
                console.log("Panel: ", panel);
                textID = panel[panel.length - 1];
            }
            else if(textID === undefined || textID === null){
                console.log("Error on getText, missing data from the payload: ", data);
                return;
            }
            console.log("Searching for textID: ", textID);
            Texts.findOne({textID: textID}, (err, data) => {
                if(err || !data) {
                    console.log("Error in getText " + err);
                    socket.emit('getText', gameFailure.BLANK_TEXT_ID);
                }
                else {
                    socket.emit('getText', data.text);
                }
            });
        }
        catch{
            console.log("Exception in getText");
        }
    });

    /*
        Save the game to the database
    */
    socket.on('saveGame', async (data) => {
        const {gameID} = data;
        if(!gameID) {
            console.log("Error in saveGame, gameID not provided");
            return;
        }
        const g = games.get(gameID);
        //Every client is going to be calling this.
        if(g){
            const gameData = new Games( {
                isComic: g.isComic,
                players: g.players,
                panels: Array.from(g.panels.values()),
                playerVotes: g.playerVotes,
                communityVotes: [],
                gameID: g.gameID,
                comments: [],
                tags: g.tags,
                creator: g.creator
            });
            games.delete(gameID);
            const savedGame = await gameData.save().then(() => {
                console.log("Game: " + gameID + " was successfully saved");
                //Push the players to seeing the published game
                //THIS MIGHT HAVE TO BE CHANGED TO SOCKET.EMIT
                io.to(gameID).emit("loadGamePage");
            });
        }
    });

    /*
        Uploading the image that was received from the message (saving it to the database)
    */
    socket.on('saveImage', async (data) => {
        if(!data.image || !data.imageID)
        {
            console.log("The necessary parameters for saving the image was not provided.");
            return;
        }

        console.log("Image received");

        const imageData = new Images({
            image: data.image,
            imageID: data.imageID
        });

        savedImage = await imageData.save();

        console.log(savedImage.imageID + " was successfully saved.");
    });

   /*
        Uploading/Saving the text that was received from the message (saving it to the database)
   */
    socket.on('saveText', async (data) => {
        if(!data.text || !data.textID)
        {
            console.log("The necessary parameters for saving the text was not provided.");
            return;
        }

        console.log("Text received");

        const textData = new Texts({
            text : data.text,
            textID : data.textID
        });

        savedText = await textData.save();

        console.log(savedText.textID + " was successfully saved.");
    });

   socket.on(gameEvents.ROUND_END, function(data) {
        console.log("Inside round end!");
        const {gameID, storyNumber, currentRound} = data;
        const g = games.get(gameID);
        if(g){
            //currentRound will be passed from the client, and will be the ID of the round that JUST ended
            g.currentRound = Math.max(g.currentRound, currentRound + 1);
            //MOVED TO SAVEIMAGE AND SAVETEXT
            console.log("Adding image/text: " + "" + data.gameID + data.storyNumber + data.currentRound + " to panel[]: " + data.storyNumber);
            g.panels.get(storyNumber).push("" + data.gameID + data.storyNumber + data.currentRound);

            setTimeout(() => {
                //Generate the new story they'll be adding to
                if(g.currentRound == g.numRounds){
                    socket.emit(gameEvents.GAME_OVER, g);    
                    g.gameStatus = gameStatus.DONE;
                }
                else{
                    let newStoryNumber = (storyNumber + g.currentRound) % g.players.length;
                    socket.emit(gameEvents.START_ROUND, newStoryNumber);
                    //Call client round end, which will call saveImage and this function again (if the game isn't over)
                    setTimeout(() => {
                        console.log("Calling roundEnd!");
                        socket.emit(gameEvents.ROUND_END, {gameID: g.gameID});
                        }, g.timePerRound * 1000);
                    }
            });    
        }
    });

});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
