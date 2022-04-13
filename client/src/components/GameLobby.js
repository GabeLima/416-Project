import { React } from 'react'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Button from '@mui/material/Button';

import LobbyCard from "./LobbyCard";
import PlayerCard from "./PlayerCard";
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import GlobalGameContext from "../game";
import AuthContext from '../auth';

//Array of objects of gameInfo
// const gameInfo = {
//     gameID: "",
//     players: [],
//     gameStatus: gameStatus.STATUS,
//     playerVotes: [[]],
//     creator: "",
//     numRounds: data.numRounds,
//     timePerRound: data.timePerRound,
//     currentRound: 0,
//     tags: []
// };

const GameLobby = (props) => {
    const history = useHistory();


    const { game } = useContext(GlobalGameContext);
    const { auth } = useContext(AuthContext);

    let playerList = game.players;
    let creator = game.creator;
    let numRounds = game.numRounds;
    let timePerRound = game.timePerRound;
    let tags = game.tags;
    let gameID = game.gameID;
    let currentUser = "";
    if(auth.user){
        currentUser = auth.user.username;
    }

    const handleLeaveGame = (event) => {
        console.log(auth.user.username + " left game");

        game.playerLeftLobby({username: auth.user.username });

        history.push('/')
    }

    const handleStartGame = (event) => {
        game.startGame();
    }

    const isOwner = (currentUser === creator);

    return (
        <div>
        <Box alignItems="center" sx={{ display: {
            backgroundColor: "#6A8D92",

        } }}>

            <Typography variant="h2"
                        noWrap
                        component="div"
                        align="center">
                    {creator + "'s Game - " + gameID}
            </Typography>

            <Box display="flex" alignItems="flex-start" justifyContent="center" gap="10px">
                <LobbyCard title="Number of Rounds:" value={numRounds + " Rounds"}/>
                <LobbyCard title="Time Per Round:" value={timePerRound + " Seconds"}/>
                <LobbyCard title="Tags:" value={tags}/>
            </Box>

            <Typography variant="h2"
                        noWrap
                        component="div"
                        align="center"
                        sx={{marginTop:5}}>
                    Player List
                </Typography>

            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap="10px">
                <List sx={{
                            marginTop:2,
                            marginLeft: "-40%",
                            justifyContent: "center",
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flexWrap: "wrap",
                            height:"325px"
                        }}>
                    {playerList.map((player, i) => {

                        return <PlayerCard key={i} username={player} isCurrentUser={currentUser === player}/>
                    })}
                </List>
            </Box>

            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap="65px" sx={{marginTop:5}}>
                <Button variant="contained"
                        style={{
                            borderRadius: 35,
                            backgroundColor: "#4b4e6d",
                            padding: "18px 36px",
                            fontSize: "18px",
                        }}
                        onClick={handleLeaveGame}
                        >
                    Leave Game
                </Button>

                <Button variant="contained"
                        style={{
                            borderRadius: 35,
                            backgroundColor: "#4b4e6d",
                            padding: "18px 36px",
                            fontSize: "18px",
                        }}
                        disabled = {isOwner ? false : true}
                        onClick={handleStartGame}
                        >
                    Start Game
                </Button>
            </Box>

            <Box sx= {{ height: 200}}/>
        </Box>
        </div>
    );
}

export default GameLobby;
