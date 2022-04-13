import { useEffect } from 'react';
import { createContext, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import AuthContext from '../auth'
import { SocketContext } from "../context/socket";
import { GlobalStoreContext } from '../store'


// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalGameContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalGameActionType = {
    CREATE_GAME: "CREATE_GAME",
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
        tags: []
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
        //TODO - change this to the enums we use in the backend
        socket.emit("CreateGame", data);
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

    useEffect(() => {
        socket.once("joinSuccess", joinSuccess);
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