import { Container, Grid, Typography, useTheme } from '@mui/material';
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
    <Link onClick={handleJoinGame} sx={{cursor:"pointer"}}>
        <Grid item m={2}>
            <Container style={{width:"330px", backgroundColor: theme.card.game.bg, borderRadius:"20px"}}>
                <Typography variant="h5" mb={2} pt={1}>
                    {creator}
                </Typography>

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
    </Link>
  )
}

export default LiveGameCard
