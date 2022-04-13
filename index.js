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
    origin: "http://localhost:3000", //LOCAL DEPLOYMENT
    //origin: "https://derit.herokuapp.com/", HEROKU DEPLOYMENT
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
// app.use(express.static(path.resolve(__dirname, "./client/build")));
// // Step 2:
// app.get("*", function (request, response) {
//   response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
// });

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
//     currentRound: 0,
//     tags: []
// };
/*
    Changing games to a map
    gameID : gameInfo
*/
var games = new Map();



io.on('connect', function (socket) {
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
    socket.once(gameEvents.CREATE_GAME, (data) => {
        console.log("Inside create game!");
        if(games.has(data.gameID))
        {
            // We couldn't properly make the room due to the ID being in use or the user already being registered as in another game.
            console.log("User " + data.email + " tried to make a room with ID " + data.gameID + " unsuccessfully.");
            socket.emit("joinSuccess", {value:false});
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
            players: [],
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
        console.log("Creating the game worked! Telling user to join game");
        joinGame(socket, data, gameInfo);
        //Tell the user joining they can switch to the game-lobby
        socket.emit("joinSuccess", {value:true, gameID:data.gameID, username:data.username, email:data.email});
        
        
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
    socket.once('joinGame', function (data) {
        if(games.has(data.gameID))
        {
            let g = games.get(data.gameID)
            if(g.gameStatus === gameStatus.LOBBY && g.players.length < gameRules.PLAYER_LIMIT)
            {
                //Add their data to the game and updating the map
                g.players.push(data.email);
                console.log("The user with email:" + data.email + " joined the game:" + data.gameID);
                joinGame(socket, data, g);
                return;
            }
        }

        //Joining the game failed
        socket.emit("joinSuccess", {value:false});
        console.log("The user with email:" + data.email + " failed to join the game:" + data.gameID);
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
                let removedI = g.playerVotes[i].indexOf(data.email);
                if(removedI > -1)
                {
                    g.playerVotes[i].splice(removedI, 1);
                    break;
                }
            }

            //Adds the vote to the 
            g.playerVotes[data.vote].push(data.email);
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
        console.log("The user with email:" + data.email + " failed to join the game:" + data.gameID);
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
                    io.to(follower.clientId).emit("newGameNotification", email + " has started a game with gameID " + gameID);
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
        const {gameID, storyNumber} = data;
        let imageID = data.imageID;

        if(!imageID || !(gameID && storyNumber)){
            console.log("Error on getImage, missing data from the payload: ", data);
            return;
        }
        if(gameID && storyNumber){
            const g = games.get(gameID);
            let panel = g.panels.get(storyNumber);
            while(panel.length < g.currentRound){
                panel.push(gameFailure.BLANK_IMAGE_ID);
            }
            imgID = panel[panel.length - 1];
        }
        Images.findOne({imageID: imageID}, (err, data) => {
            if(err ||!data) {
                console.log("Error in getImage: " + err);
                socket.emit('getImage', false);
            }
            else {
                socket.emit('getImage', data.image);
            }
        });
    });

    /*
        Returns text from the database
    */
    socket.on('getText', function(data) {
        // get imgID from gameID and storyNumber
        const {gameID, storyNumber} = data;
        let textID = data.textID;
        if(!textID || !(gameID && storyNumber)){
            console.log("Error on getText, missing data from the payload: ", data);
            socket.emit('getText', false);
            return;
        }
        if(gameID && storyNumber){
            const g = games.get(gameID);
            let panel = g.panels.get(storyNumber);
            while(panel.length < g.currentRound){
                panel.push(gameFailure.BLANK_TEXT_ID);
            }
            textID = panel[panel.length - 1];
        }
        Texts.findOne({textID: textID}, (err, data) => {
            if(err || !data) {
                console.log("Error in getText " + err);
                socket.emit('getText', false);
            }
            else {
                socket.emit('getText', data.text);
            }
        });
    });

    /*
        Save the game to the database
    */
    socket.on('saveGame', async (data) => {
        const {gameID} = data
        if(!gameID) {
            console.log("Error in saveGame, gameID not provided");
            return;
        }
        const g = games.get(gameID);
 
        const gameData = new Game( {
            isComic: true,
            players: g.players,
            panels: g.panels,
            playerVotes: g.playerVotes,
            communityVotes: [],
            gameID: g.gameID,
            comments: [],
            tags: g.tags,
            creator: g.creator
        });
        const savedGame = await gameData.save().then(() => {
            games.delete(gameID);
            console.log(savedGame.gameID + " was successfully saved");
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
        console.log(data.textID + " : " + data.text);

        const textData = new Texts({
            text : data.text,
            textID : data.textID
        });

        savedText = await textData.save();

        console.log(savedText.textID + " was successfully saved.");
    });

   socket.on('roundEnd', function(data) {
    const {gameID, storyNumber, currentRound} = data;
    const g = games.get(gameID);
    //currentRound will be passed from the client, and will be the ID of the round that JUST ended
    g.currentRound = Math.max(g.currentRound, currentRound + 1);
    //Add the imageID to every story
    g.panels.get(storyNumber).push("" + data.gameID + data.storyNumber + currentRound);

    setTimeout(() => {
        //Generate the new story they'll be adding to
        if(g.currentRound == g.numRounds){
            socket.emit(gameEvents.GAME_OVER, g);    
            g.gameStatus = gameStatus.DONE;
        }
        else{
            let newStoryNumber = (storyNumber + g.currentRound) % g.players.length;
            socket.emit(gameEvents.START_ROUND, newStoryNumber);
        }
    }, 500);

    //Call client round end, which will call saveImage and this function again (if the game isn't over)
    setTimeout(() => {
        io.to(gameID).emit(gameEvents.ROUND_END);
        }, g.timePerRound * 1000);
    });



});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
