import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';

import React, { useEffect, useState } from 'react'
import StoryCard from './StoryCard';
import GameComment from './GameComment';

// Page viewed after clicking on a completed game card

const GameResult = () => {
  const [playerWinner, setPlayerWinner] = useState(-1);
  const [commWinner, setCommWinner] = useState(-1);

  //Hard coded example data
  const panels=[
    ["/images/1.png", "/images/2.png", "/images/3.png", "/images/4.png"],
    ["/images/1.png", "/images/1.png", "/images/1.png", "/images/1.png"]
  ];

  const communityVotes=[
    ["npc1", "npc2"],
    []
  ];

  const comments=[
    {
      user:"user1",
      message:"WOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH I can't believe what i'm seeing this reminds me of this one scene from another series. This made me want to go back and reread that series again.",
      postDate:new Date()
    },
    {
      user:"user2",
      message:"Wow, this was the best thing I've ever seen in my life. I will never be the same. 10 out of 10, would recommend.",
      postDate:new Date()
    },
    {
      user:"user3",
      message:"This was my favorite part! I've looked at this for over  5 hours and can't get it out my head!",
      postDate:new Date()
    },
    {
      user:"user4",
      message:"I hope one day I can see something as beautiful as this again. I can't believe something as amazing as this exists!",
      postDate:new Date()
    },
    {
      user:"user5",
      message:"I hope the user above me has a good day",
      postDate:new Date()
    },
  ]

  useEffect(() => {
    let max = -1;
    let win = -1;

    for(let i = 0; i < communityVotes.length; i++)
    {
      if(communityVotes[i].length > max){
        max = communityVotes[i].length;
        win = i;
      }
    }

    setCommWinner(win);
    console.log(commWinner);
  }, [commWinner]);

  return (
    <div className='back'>
      <Box textAlign='center' mt={5} className="Game" >
        <Button variant="outlined" style={{backgroundColor:"#4b4e6d", color:"white", fontWeight:"bold"}} size="large">
          Play Again
        </Button>

        <>
          {panels.map((story, index) => (
            <StoryCard content={story} winner={commWinner===index}/>
          ))}
        </>
      </Box>

      <Box mt={8} className="Comments" pb={5}>
        <Typography variant="h2" align="center" style={{color:"#4b4e6d", textDecoration:"underline"}} mb={4} mt={3}>
            Comments
        </Typography>

        <Container id="comment-space" style={{width:"72%"}}>
          <TextField id="comment" variant="filled" fullWidth multiline label="Add a comment" ></TextField>
          <Grid container justifyContent="right">
            <Grid item mt={2} mb={4}>
              <Button style={{backgroundColor:"#4b4e6d", color:"white", fontWeight:"600"}}>Comment</Button>
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
