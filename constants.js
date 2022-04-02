const gameEvents ={
    JOINING_GAME : "JoiningGame",
    LEAVING_GAME: "LeavingGame",
    START_GAME: "StartGame",
    CREATE_GAME: "CreateGame",
    ROUND_END: "RoundEnd",
    START_ROUND: "StartRound",
    GAME_OVER: "GameOver"
};

const gameRules = {
    PLAYER_LIMIT : 8,
    DEFAULT_NUM_ROUNDS: 8, // TODO - I have no idea what this should be, I believe it's dependent on the game algorithm @vicky @ david
    DEFAULT_TIME_PER_ROUND: 60, // TODO - 60 seconds sounds fair, we can decide on this later.
};

const gameStatus ={
    LOBBY : "lobby", // Waiting for players
    PLAYING: "playing", // Drawing the games
    DONE: "done" //We finished playing, but users are still voting
};

const gameFailure ={
    BLANK_IMAGE_ID : "0",
    BLANK_TEXT_ID: "0"
};

module.exports = {
    gameEvents,
    gameRules,
    gameStatus,
    gameFailure
}