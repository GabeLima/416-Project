import socketio from "socket.io-client";
import { createContext } from 'react'
import { SOCKET_ENDPOINT } from "../config";

export const socket = socketio.connect(SOCKET_ENDPOINT);
export const SocketContext = createContext();

socket.on('connect', function() {
    console.log("Connected to server");
  });

//   socket.once("joinSuccess", (data) => {
//     const {value, gameID, email, username} = data;
//     //If joinSuccess is a success (bad naming), we switch to the lobby page
//     if(value===true){
//         console.log("Received a joinSuccess! Switching to the game lobby");
//         //Add ourselves to the player list
//         //game.players.push(username);
//         //Tell the other user's we're joining
//         //We cant do game.gameID here because the reducer is too slow.
//         socket.emit("joinGame", {gameID: gameID, username:username, email:email});
//         //Switch to the lobby of the game 
//         //history.push("lobby");
//     }
//     else{
//         console.log("Received a false joinSuccess. Staying in createGame.");
//         //store.setErrorMessage("There was an error joining the game!");

//     }
// });