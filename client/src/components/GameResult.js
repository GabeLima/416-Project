import { Box, Button, Container, Grid, TextField, Typography, useTheme } from '@mui/material';

import React, { useEffect, useState } from 'react'
import StoryCard from './StoryCard';
import GameComment from './GameComment';
import { useLocation } from 'react-router-dom';
import api from '../api'

// Page viewed after clicking on a completed game card

const GameResult = () => {
  const [playerWinner, setPlayerWinner] = useState(-1);
  const [commWinner, setCommWinner] = useState(-1);

  const [game, setGame] = useState();

  const location = useLocation();
  
  const getGame = async (gameID) => {
    let res = await api.getGame(gameID);
    if (res.data.success) {
      let gameResult = res.data.game;
      console.log("Game found");
      console.log(gameResult);
      setGame(gameResult);
    }
  }
  
  useEffect(() => {
    let gameID = location.pathname.split("gameResult/")[1];
    getGame(gameID);
  }, []);

  let communityVotes, panels, comments;
  let winnerVotes = 0;
  let winnerIndex = 0;

  if (game) {
    communityVotes = game.communityVotes;
    panels = game.panels;
    comments = game.comments;
    communityVotes.forEach((subset, i) => {
      if (subset.length > winnerVotes) {
        winnerVotes = subset.length;
        winnerIndex = i;
      }
    });

  }
  else {
    communityVotes = [];
    panels = [];
    comments = [];
  }
  

  const theme = useTheme();
  return (
    <div className='back'>
      <Box textAlign='center' mt={5} className="Game" >
        <Button variant="outlined" style={{backgroundColor: theme.button.bg, color: theme.button.text, fontWeight:"bold"}} size="large">
          Play Again
        </Button>

        <>
          {panels.map((story, index) => (
            <StoryCard content={story} winner={winnerIndex===index}/>
          ))}
        </>
      </Box>

      <Box mt={8} className="Comments" pb={5}>
        <Typography variant="h2" align="center" style={{color: theme.results.text, textDecoration:"underline"}} mb={4} mt={3}>
            Comments
        </Typography>

        <Container id="comment-space" style={{width:"72%"}}>
          <TextField id="comment" variant="filled" fullWidth multiline label="Add a comment" ></TextField>
          <Grid container justifyContent="right">
            <Grid item mt={2} mb={4}>
              <Button style={{backgroundColor: theme.button.bg, color: theme.button.text, fontWeight:"600"}}>Comment</Button>
            </Grid>
          </Grid>
        </Container>

        {comments.map(({user, message, postDate}) => (
          <GameComment user={user} message={message} postDate={postDate}/>
        ))}
      </Box>
    </div>
  )
}

export default GameResult;
