import {gameEvents, gameRules, gameStatus }from "./constants.js";


joinGame = (socket, data, g) => {
    
    socket.join(g.gameID);

    //Tell other users that a new player is joining
    socket.to(g.gameID).emit(gameEvents.JOINING_GAME, data.userName);

    //Tell the user joining they can switch to the game-lobby
    socket.emit("joinSuccess", true);
    console.log("The user with email:" + data.userEmail + " joined the game:" + data.gameID);
    return;
}

startGame = (io, g) => {
    g.gameStatus = gameStatus.PLAYING;

    // Tell the users that the game is starting.
    io.to(g.gameID).emit(gameEvents.START_GAME);

    // We'll be storing timePerRound as seconds, so we need to multiply accordingly to reach ms.
    setTimeout(() => {
        io.to(g.gameID).emit(gameEvents.ROUND_END);
    }, g.timePerRound * 1000);
    return;
}


modules.export = {
    createGame,
    joinGame,
    startGame
}