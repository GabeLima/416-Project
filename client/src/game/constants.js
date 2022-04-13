const gameEvents ={
    JOINING_GAME : "JoiningGame",
    LEAVING_GAME: "LeavingGame",
    START_GAME: "StartGame",
    CREATE_GAME: "CreateGame",
    ROUND_END: "RoundEnd",
    START_ROUND: "StartRound",
    GAME_OVER: "GameOver"
};

const gameStatus ={
    LOBBY : "lobby", // Waiting for players
    PLAYING: "playing", // Drawing the games
    DONE: "done", //We finished playing, but users are still voting
    ROUND_END: "round end"
};

module.exports = {
    gameEvents,
    gameStatus
}