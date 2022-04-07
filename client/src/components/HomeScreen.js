import React from 'react';
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import { useContext } from 'react'
import { Container, Typography } from '@mui/material'
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import { ToggleButton } from '@mui/material';
import { ToggleButtonGroup } from '@mui/material';
import { Grid } from '@mui/material';
import LiveGameCard from './LiveGameCard';

// toggles between live and completed games
const GameToggle = () => {
    const [alignment, setAlignment] = React.useState('completed');
        const handleChange = (event, newAlignment) => {
            if(newAlignment !== null) {
                setAlignment(newAlignment);
            }
        };
        return (
        <ToggleButtonGroup 
            exclusive 
            onChange={handleChange}
            value={alignment}
            sx = {{
                px: 2
            }}
        >
            <ToggleButton color="secondary" value="completed">
                <Typography><strong>Completed</strong></Typography>
            </ToggleButton>
            <ToggleButton color="secondary" value="live">
                <Typography><strong>Live</strong></Typography>
            </ToggleButton>
        </ToggleButtonGroup>
        );
};

const HomeScreen = () => {
    //const { auth } = useContext(AuthContext);
    //const { store } = useContext(GlobalStoreContext);


    // useEffect(() => {
    //     store.loadIdNamePairs();
    // }, []);

    // obtain a list of cards based on what is being asked
    // Story/Comic
    // Completed/Joinable

    //Example data
    const liveGames = [
        {
            players:["tim, gabe, david, vicky"],
            creator:"tim",
            gameID : "IYBH",
            numRounds : 5,
            timePerRound : 30,
            tags : ["Anime", "Superpower", "Stickman", "Basic"]
        },
        {
            players:["tim, gabe, david, vicky"],
            creator:"gabe",
            gameID : "JYGS",
            numRounds : 2,
            timePerRound : 10,
            tags : []
        },
    ];

    return (
        <>
        <Box className="back" pb={4}>
            <Typography align="center" variant="h1">Games</Typography>
            <Grid 
                container 
                justifyContent="right"
                direction='row'
            >
                <Box sx={{px: 4}}>
                    <Typography align="center" variant="h4">Filter Games</Typography>
                    <GameToggle />
                    <Typography align="center" variant="h4">Join Game</Typography>
                    <TextField name="game-code" label="Game Code" id="game-code"/>
                </Box>
            </Grid>

            <Grid container>
                {liveGames.map(({creator, gameID, numRounds, timePerRound, tags}) => (
                    <LiveGameCard creator={creator} gameID={gameID} numRounds={numRounds} timePerRound={timePerRound} tags={tags}/>
                ))}
            </Grid>


        </Box>
        </>
    )
}

export default HomeScreen;