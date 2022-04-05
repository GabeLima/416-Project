import { React, useState } from 'react'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Button from '@mui/material/Button';

import LobbyCard from "./LobbyCard";
import PlayerCard from "./PlayerCard";

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
    // TODO : REMOVE
    const propsHardcoded = {
        currentUser: "aoi",
        game: {
            playerList: ["hatsuyuki", "picard", "fuyu", "aoi", "mckenna", "", "", ""],
            creator: "hatsuyuki",
            numRounds: 5,
            timePerRound: 30,
            tags: ["Comedy", "Anime", "Family-Friendly"]
        }
    }
    // TODO : REMOVE ABOVE

    const { playerList, creator, numRounds, timePerRound, tags } = propsHardcoded.game; // TODO - update this to just props
    const currentUser = propsHardcoded.currentUser; // TODO - maybe we use the global store to get this?

    // TODO - When we bring in state/the store, we'll want to determine who the user is that is actually invoking these events.
    const handleLeaveGame = (event) => {
        console.log("User left game");
    }

    const handleStartGame = (event) => {
        console.log("User started game");
    }

    const isOwner = (currentUser === creator);

    return (
        <div>
        <Box alignItems="center" sx={{ display: {
            backgroundColor: "#6A8D92",

        } }}>

            <Typography variant="h1"
                        noWrap
                        component="div"
                        align="center">
                    {creator + "'s Game"}
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
                <List height="305px" sx={{
                            marginTop:2,
                            marginLeft: "-40%",
                            justifyContent: "center",
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flexWrap: "wrap",
                            height:"305px"
                        }}>
                    {playerList.map((player, i) => {

                        return <PlayerCard username={player} isCurrentUser={currentUser === player}/>
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
