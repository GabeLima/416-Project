const gameEvents ={
    joiningGame : "USER-JOINING",
    leavingGame : "USER-LEAVING",
    startGame : "GAME-STARTED",
};

const gameRules = {
    playerLimit:8
};

const gameStatus ={
    lobby: "LOBBY", // Waiting for players
    playing: "PLAYING", // Drawing the games
    done: "DONE" //We finished playing, but users are still voting
}