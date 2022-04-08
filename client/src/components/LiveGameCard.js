import { Box, Container, Grid, Typography } from '@mui/material';
import Tags from "./Tags"
import React from 'react'

const LiveGameCard = ({creator, gameID, numRounds, timePerRound, tags}) => {
  return (
    <Grid item m={2}>
        <Container style={{width:"330px", backgroundColor:"#80B192", borderRadius:"20px"}}>
            <Typography variant="h5" mb={2} pt={1}>
                {creator}
            </Typography>

            <Typography variant="h1" mb={1}>
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
