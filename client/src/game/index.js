import { useEffect } from 'react';
import { createContext, useState, useContext, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import AuthContext from '../auth'
import { SocketContext } from "../context/socket";
import { GlobalStoreContext } from '../store'
import {gameEvents, gameStatus} from "./constants"


// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalGameContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalGameActionType = {
    CREATE_GAME: "CREATE_GAME",
    START_ROUND: "START_ROUND",
    SET_PREVIOUS_PANEL: "SET_PREVIOUS_PANEL",
    UPDATE_GAME_STATUS: "UPDATE_GAME_STATUS",
    RESET_GAME_INFO: "RESET_GAME_INFO",
    PLAYER_LIST_UPDATE: "PLAYER_LIST_UPDATE",
    UPDATE_STORY_NUMBER: "UPDATE_STORY_NUMBER"

}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalGameContextProvider(props) {


    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [game, setGame] = useState({
        gameID: "fakeID",
        players: [],
        gameStatus: "",
        creator: "",
        numRounds: 0,
        timePerRound: 30,
        currentRound: 0,
        tags: [],
        storyNumber: 0,
        previousPanel: "", //Its either text, or its the image. 
        isComic: true,
        initialStoryNumber: 0
    });


    //SETUP THE CLIENT SOCKET
    const socket = useContext(SocketContext);
    //console.log("First socket: ", socket);
    const history = useHistory();
    const { store } = useContext(GlobalStoreContext);

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);


    //Setup the gameRef for the socket functions
    const gameRef = useRef(game);
    const authRef = useRef(auth);
    const storeRef = useRef(store);
    //This runs ever render to update the gameRef
    useEffect(() => {
        gameRef.current = game;
        authRef.current = auth;
        storeRef.current = store;
    });



    const storeReducer = (action) => {
        const { type, payload } = action;
        let currentGame = gameRef.current;
        switch (type) {
            case GlobalGameActionType.CREATE_GAME: {
                return setGame({
                    ...currentGame,
                    gameID: payload.gameID,
                    numRounds: payload.numRounds,
                    timePerRound: payload.timePerRound, 
                    creator: payload.username,
                    tags: payload.tags,
                    gameStatus: gameStatus.LOBBY
                });
            }
            case GlobalGameActionType.LOAD_LOBBY: {
                console.log("LOAD LOBBY CALLED WITH PAYLOAD: ", payload);
                return setGame({
                    ...currentGame,
                    gameID: payload.gameID,
                    players:payload.players,
                    creator: payload.creator,
                    numRounds: payload.numRounds,
                    timePerRound: payload.timePerRound,
                    tags: payload.tags
                })
            }
            case GlobalGameActionType.START_ROUND: {
                return setGame({
                    ...currentGame,
                    storyNumber:payload.storyNumber,
                    currentRound: payload.currentRound,
                    gameStatus: gameStatus.START_ROUND
                });
            }
            case GlobalGameActionType.UPDATE_GAME_STATUS: {
                return setGame({
                    ...currentGame,
                    gameStatus: payload
                });
            }
            case GlobalGameActionType.UPDATE_STORY_NUMBER: {
                return setGame({
                    ...currentGame,
                    storyNumber: payload,
                    initialStoryNumber: payload
                });
            }
            case GlobalGameActionType.SET_PREVIOUS_PANEL: {
                console.log("Setting previous panel to: ", payload);
                return setGame({
                    ...currentGame,
                    previousPanel:payload,
                    gameStatus: gameStatus.PLAYING
                });
            }
            case GlobalGameActionType.PLAYER_LIST_UPDATE: {
                return setGame({
                    ...currentGame,
                    players: payload
                });
            }
            case GlobalGameActionType.RESET_GAME_INFO: {
                //SET THIS TO WHATEVER THE INITIAL STATE IS
                // We do this to not carry over state to other games.
                return setGame({
                    gameID: "fakeID",
                    players: [],
                    gameStatus: "",
                    creator: "",
                    numRounds: 0,
                    timePerRound: 30,
                    currentRound: 0,
                    tags: [],
                    storyNumber: 0,
                    previousPanel: "", //Its either text, or its the image. 
                    isComic: true,
                    initialStoryNumber: 0
                });
            }
            default:
                return game;
        }
    }

    useEffect(() => {
        console.log(game, '- Has changed')
    },[game]) // <-- here put the parameter to listen

    game.createGame = function (data) {
        // const {gameID, numRounds, timePerRound, email, username} = data;
        storeReducer({
            type: GlobalGameActionType.CREATE_GAME,
            payload: data
        });
        socket.emit(gameEvents.CREATE_GAME, data);
        socket.emit('notifyFollowers', data);
    }

    game.joinGame = (data) => {
        storeReducer({
            type: GlobalGameActionType.RESET_GAME_INFO
        });
        socket.emit("joinGame", {gameID: data.gameID, email: data.email, username: data.username, storeIsComic: store.isComic});
    }

    game.setPreviousPanel =() =>{
        console.log("GameRef: ", gameRef.current);
        let currentGame = gameRef.current;
        if(currentGame.currentRound >= 0 && currentGame.storyNumber !== undefined && currentGame.gameID !== "fakeID"){
            const ID = "" + currentGame.gameID + currentGame.storyNumber + (currentGame.currentRound -1);
            if(storeRef.current.isComic === true){
                console.log("Emitting getImage");
                socket.emit("getImage", {gameID: currentGame.gameID, storyNumber: currentGame.storyNumber});
            }
            else{
                console.log("Emitting getText");
                socket.emit("getText", {gameID: currentGame.gameID, storyNumber: currentGame.storyNumber});
            }
        }
    }


    game.savePanel = function (data){
        const ID = "" + game.gameID + game.storyNumber + game.currentRound;
        if(storeRef.current.isComic === true){
            console.log("Calling saveImage");
            socket.emit("saveImage", {image: data, imageID: ID, storyNumber: game.storyNumber});
        }
        else{
            socket.emit("saveText", {text: data, textID: ID, storyNumber: game.storyNumber});
        }
    }

    // handle the current client leaving a game
    // if the creator left, we need to promote the next person in line. if players left are 0, we just delete the game.
    game.playerLeftLobby = (data) => {
        const { username } = data;
        console.log(username + " left game");

        if (game.players.length === 1) {
            // we would have no one left, just delete the game.
            socket.emit("deleteEmptyLobby", {gameID: game.gameID});
            return;
        }
        socket.emit("playerLeftLobby", {gameID: game.gameID, username: username});
        
    }

    

    game.startGame = () =>{
        console.log(game.gameID);
        //Setup our storyNumber to be our playerNumber
        socket.emit(gameEvents.START_GAME, {gameID: game.gameID})
    }
    // Notify existing players that a player left


    game.saveGame = () =>{
        console.log("Saving the game!")
        let currentGame = gameRef.current;
        socket.emit("saveGame", {gameID: currentGame.gameID});

    }

    // Notify existing players that a player left
    const playerLeftLobby = (data) => {
        // TODO - add a notification or smth?
        const { gameInfo } = data;

        if (gameInfo.creator !== game.creator) {
            console.log(gameInfo.creator + " was promoted to room owner/leader.");
        }
        
        console.log(gameInfo);
        storeReducer({
            type: GlobalGameActionType.LOAD_LOBBY,
            payload: gameInfo
        });
    }


    const joinSuccess = (data) =>{
        console.log(data);
        const {value, gameID, username} = data;
        //If joinSuccess is a success (bad naming), we switch to the lobby page
        if(value===true){
            console.log("Received a joinSuccess! Switching to the game lobby");
            console.log(data);
            console.log(data.gameInfo.isComic);
            console.log(store.isComic);
            if (data.gameInfo.isComic !== storeRef.current.isComic) {
                console.log("User isComic mismatch in joining a game. Store will gracefully switch game modes to allow the user to join.");

                storeRef.current.handleChangeMode();

            }
            storeReducer({
                type: GlobalGameActionType.LOAD_LOBBY,
                payload: data.gameInfo
            });

            //Tell the other user's we're joining
            //We cant do game.gameID here because the reducer is too slow.
            socket.emit("joinGame", {gameID: gameID, username:username});
            //Switch to the lobby of the game 
            history.push("lobby");

            //TODO - call updateGameInfo here and pass in the stuff from createGame

        }
        else{
            console.log("Received a false joinSuccess. Staying in createGame.");
            store.setErrorMessage("There was an error joining the game!");

        }
    }

    const startRound = (newStoryNumber) =>{
        console.log("START_ROUND received, starting the round! New story number: ", newStoryNumber);
        let currentGame = gameRef.current;
        if(newStoryNumber !== undefined && newStoryNumber !== null){
            console.log("Start Round Reducer being called as newStoryNumber is valid!");
            storeReducer({
                type: GlobalGameActionType.START_ROUND,
                payload: {storyNumber: newStoryNumber, currentRound: currentGame.currentRound + 1}
            });
        }
    }

    const roundEnd = (data) =>{
        let currentGame = gameRef.current;
        if(data.gameID === gameRef.current.gameID){
            console.log("Round end received! Sending it back to the server");
            socket.emit(gameEvents.ROUND_END, {gameID: currentGame.gameID, storyNumber: currentGame.initialStoryNumber, currentRound: currentGame.currentRound});
        }
        else{
            console.log("Not sending round end back to server as we're in a different game!");
        }
    }

    const joiningGame = (data) => {
        const { username, gameInfo } = data;
        console.log("New player joined:" + username);
        console.log(game);
        console.log(gameInfo);
        storeReducer({
            type: GlobalGameActionType.LOAD_LOBBY,
            payload: gameInfo
        });
    }

    const setPreviousPanel = (data) =>{
        if(data === false){
            console.log("There was an error setting the previous panels information!");
        }
        else{
            console.log("Setting previous panel to: ", data);
            storeReducer({
                type: GlobalGameActionType.SET_PREVIOUS_PANEL,
                payload: data
            });
        }
    }

    const gameOver = (data) =>{
        let currentGame = gameRef.current;
        if(data.gameID !== currentGame.gameID){
            console.log("Something went wrong in gameOver!", data.gameID, currentGame.gameID);
        }
        else{
            //CGameInProgress will see this and call game.saveGame
            storeReducer({
                type: GlobalGameActionType.UPDATE_GAME_STATUS,
                payload: gameStatus.GAME_OVER
            });
            //We can't push to gameResult here as the socket might not have finished actually saving the game 
        }
    }

    const loadGamePage = () =>{
        let currentGame = gameRef.current;
        //Push the player to seeing the published game
        history.push("/gameResult/" + currentGame.gameID);
        //Reset the game state client side
        storeReducer({
            type: GlobalGameActionType.RESET_GAME_INFO
        });
    }
    
    const startGame = (data) =>{
        const { gameInfo } = data;
        let currentGame = gameRef.current;
        const players = currentGame.players;
        
        let storyNumber = players.indexOf(authRef.current.user.username);
        console.log("Initial storyNumber: ", storyNumber)
        storeReducer({
            type: GlobalGameActionType.UPDATE_STORY_NUMBER,
            payload: storyNumber
        });

        console.log("Game we're pushing to: " + gameInfo.gameID);
        if(storeRef.current.isComic === true){
            history.push("/CGameInProgress/" + gameInfo.gameID);
        }
        else{
            history.push("/SGameInProgress/" + gameInfo.gameID);
        }
    }



    useEffect(() => {
        socket.on("joinSuccess", joinSuccess);
        socket.on(gameEvents.ROUND_END, roundEnd);
        socket.on(gameEvents.START_ROUND, startRound);
        socket.on("getImage", setPreviousPanel);
        socket.on("getText", setPreviousPanel);
        socket.on(gameEvents.GAME_OVER, gameOver);
        socket.on("loadGamePage", loadGamePage);
        socket.on(gameEvents.JOINING_GAME, joiningGame);
        socket.on("playerLeftLobby", playerLeftLobby);
        socket.on(gameEvents.START_GAME, startGame);
    }, []);

  
      return(
        <GlobalGameContext.Provider value={{
            game
        }}>
            {props.children}
        </GlobalGameContext.Provider>
    );

}

export default GlobalGameContext;
export { GlobalGameContextProvider };
