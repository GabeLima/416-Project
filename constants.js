const gameEvents ={
    JOINING_GAME : "JoiningGame",
    LEAVING_GAME: "LeavingGame",
    START_GAME: "StartGame",
};

const gameRules = {
    PLAYER_LIMIT : 8
};

const gameStatus ={
    LOBBY : "lobby", // Waiting for players
    PLAYING: "playing", // Drawing the games
    DONE: "done" //We finished playing, but users are still voting
}