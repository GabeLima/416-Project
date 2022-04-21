import { Container, Grid, Typography, useTheme, Button } from '@mui/material';
import Tags from "./Tags";
import React from 'react';
import { useContext } from "react";
import Link from '@mui/material/Link';
import AuthContext from '../auth'
import GlobalGameContext from "../game";

const LiveGameCard = ({creator, gameID, numRounds, timePerRound, tags}) => {

  const theme = useTheme();

  const {auth} = useContext(AuthContext);
  const { game } = useContext(GlobalGameContext);

  const handleJoinGame = () => {
      if (!auth.user) {return;}
    console.log("Attempting to join game with ID " + gameID);
    game.joinGame({gameID: gameID, username: auth.user.username});
  }
  
  return (
    <Grid item m={2}>
        <Container style={{width:"330px", backgroundColor: theme.card.game.bg, borderRadius:"20px"}}>
            
            <Grid container>
                <Grid item xs={9}>
                <Typography variant="h5" mb={2} pt={1}>
                    {creator}
                </Typography>
                </Grid>

                <Grid item pt={1}>
                    <Button 
                    style={{backgroundColor: theme.card.game.button, color:"black"}}
                    onClick={handleJoinGame}
                >Join</Button>
                </Grid>
            </Grid>

            <Typography variant="h2" mb={1}>
                {gameID}
            </Typography>

            <Typography variant="subtitle1" mb={1}>
                Rounds: {numRounds}; Time per round: {timePerRound}
            </Typography>

            <Grid container spacing={1} pb={2} sx={{overflow:"auto"}}>
                {tags.map((tag) => (
                    <Tags tag={tag}/>
                ))}
            </Grid>
        </Container>
    </Grid>
  )
}

export default LiveGameCard
