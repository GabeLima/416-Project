const {gameEvents, gameRules, gameStatus, gameFailure} = require("./constants");

joinGame = (socket, data, g) => {
    
    socket.join(g.gameID);

    //Tell other users that a new player is joining
    socket.to(g.gameID).emit(gameEvents.JOINING_GAME, data.username);
    return;
}

function startGame(io, g){
    // Tell the users that the game is starting.
    io.to(g.gameID).emit(gameEvents.START_GAME);

    // We'll be storing timePerRound as seconds, so we need to multiply accordingly to reach ms.
    setTimeout(() => {
        io.to(g.gameID).emit(gameEvents.ROUND_END);
    }, g.timePerRound * 1000);
    return;
}


module.exports = {
    joinGame,
    startGame
}