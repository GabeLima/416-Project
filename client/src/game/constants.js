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
    ROUND_END: "round end",
    START_ROUND: "START_ROUND"
};

const gameFailure ={
    BLANK_IMAGE_ID : "0",
    BLANK_TEXT_ID: "0"
};

module.exports = {
    gameEvents,
    gameStatus,
    gameFailure
}