import { useEffect } from 'react';
import { createContext, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import AuthContext from '../auth'
import { SocketContext } from "../context/socket";
import { GlobalStoreContext } from '../store'
import {gameEvents} from "./constants"


// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalGameContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalGameActionType = {
    CREATE_GAME: "CREATE_GAME",
    START_ROUND: "START_ROUND",
    SET_PREVIOUS_PANEL: "SET_PREVIOUS_PANEL",
    RESET_GAME_INFO: "RESET_GAME_INFO"
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
        timePerRound: 0,
        currentRound: 0,
        tags: [],
        storyNumber: 0,
        previousPanel: "" //Its either text, or its the image. 
    });

    //SETUP THE CLIENT SOCKET
    const socket = useContext(SocketContext);
    console.log("First socket: ", socket);
    const history = useHistory();
    const { store } = useContext(GlobalStoreContext);

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalGameActionType.CREATE_GAME: {
                return setGame({
                    ...game,
                    gameID: payload.gameID,
                    numRounds: payload.numRounds,
                    timePerRound: payload.timePerRound, 
                    creator: payload.username
                });
            }
            case GlobalGameActionType.START_ROUND: {
                return setGame({
                    ...game,
                    storyNumber:payload.storyNumber,
                    currentRound: payload.currentRound
                });
            }
            case GlobalGameActionType.SET_PREVIOUS_PANEL: {
                return setGame({
                    ...game,
                    previousPanel:payload
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
                    timePerRound: 0,
                    currentRound: 0,
                    tags: [],
                    storyNumber: 0,
                    previousPanel: ""
                });
            }
            default:
                return game;
        }
    }

    game.createGame = function (data) {
        // const {gameID, numRounds, timePerRound, email, username} = data;
        storeReducer({
            type: GlobalGameActionType.CREATE_GAME,
            payload: data
        });
        socket.emit(gameEvents.CREATE_GAME, data);
    }

    game.setPreviousPanel = function (){
        if(game.currentRound > 0){
            if(store.isComic === true){
                socket.emit("getImage", {gameID: game.gameID, storyNumber: game.storyNumber});
            }
            else{
                socket.emit("getText", {gameID: game.gameID, storyNumber: game.storyNumber});
            }
        }
    }

    const joinSuccess = (data) =>{
        console.log(data);
        const {value, gameID, email, username} = data;
        //If joinSuccess is a success (bad naming), we switch to the lobby page
        if(value===true){
            console.log("Received a joinSuccess! Switching to the game lobby");
            //Add ourselves to the player list
            game.players.push(username);
            //Tell the other user's we're joining
            //We cant do game.gameID here because the reducer is too slow.
            socket.emit("joinGame", {gameID: gameID, username:username, email:email});
            //Switch to the lobby of the game 
            history.push("lobby");
            //TODO - call updateGameInfo here and pass in the stuff from createGame
        }
        else{
            console.log("Received a false joinSuccess. Staying in createGame.");
            store.setErrorMessage("There was an error joining the game!");

        }
    }

    const roundEnd = (data) =>{
        const {image, text} = data;
        const ID = "" + game.gameID + game.storyNumber + game.currentRound;
        if(store.isComic === true){
            socket.emit("saveImage", {image: image, imageID: ID});
        }
        else{
            socket.emit("saveText", {text: text, textID: ID});
        }
        //Tell the server the round ended, and start the self-looping again
        socket.emit("roundEnd", {gameID: game.gameID, storyNumber: game.storyNumber, currentRound: game.currentRound});
    }

    const startRound = (newStoryNumber) =>{
        if(newStoryNumber){
            storeReducer({
                type: GlobalGameActionType.START_ROUND,
                payload: {storyNumber: newStoryNumber, currentRound: game.currentRound + 1}
            });
        }
    }

    const setPreviousPanel = (data) =>{
        if(data === false){
            console.log("There was an error setting the previous panels information!");
        }
        else{
            storeReducer({
                type: GlobalGameActionType.SET_PREVIOUS_PANEL,
                payload: data
            });
        }
    }

    const gameOver = (data) =>{
        if(data.gameID !== game.gameID){
            console.log("Something went wrong in gameOver!", data.gameID, game.gameID);
        }
        else{
            socket.emit("saveGame", game.gameID);
            //We can't push to gameResult here as the socket might not have finished actually saving the game 
        }
    }

    const loadGamePage = () =>{
        history.push("/gameResult/" + game.gameID);
        storeReducer({
            type: GlobalGameActionType.RESET_GAME_INFO
        });
    }


    useEffect(() => {
        socket.once("joinSuccess", joinSuccess);
        socket.once(gameEvents.ROUND_END, roundEnd);
        socket.once(gameEvents.START_ROUND, startRound);
        socket.once("getImage", setPreviousPanel);
        socket.once("getText", setPreviousPanel);
        socket.once(gameEvents.GAME_OVER, gameOver);
        socket.once("loadGamePage", loadGamePage);

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