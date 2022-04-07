import { Avatar, Box, Button, Container, Grid } from '@mui/material';
import SimpleImageSlider from "react-simple-image-slider";

import { color, fontWeight } from '@mui/system';
import React, { useEffect, useState } from 'react'
import StoryCard from './StoryCard';

const GameResult = () => {
  const [playerWinner, setPlayerWinner] = useState(-1);
  const [commWinner, setCommWinner] = useState(-1);

  const panels=[
    ["/images/1.png", "/images/2.png", "/images/3.png", "/images/4.png"],
    ["/images/1.png", "/images/1.png", "/images/1.png", "/images/1.png"]
  ];

  const playerVotes=[
    ["player1", "player2"],
    []
  ];

  const commVotes=[
    [],
    ["npc1", "npc2"]
  ];
  
  useEffect(() => {
    let max = -1;
    let win = -1;
    for(let i = 0; i < playerVotes.length; i++)
    {
      if(playerVotes[i].length > max){
        max = playerVotes[i].length;
        win = i;
      }
    }

    setPlayerWinner(win);

    max = -1;
    win = -1;
    for(let i = 0; i < commVotes.length; i++)
    {
      if(commVotes[i].length > max){
        max = commVotes[i].length;
        win = i;
      }
    }

    setCommWinner(win);
    console.log(commWinner);
  });

  return (
    <div className='back'>
      <Box textAlign='center' mt={5} className="Game" >
        <Button variant="outlined" style={{backgroundColor:"#4b4e6d", color:"white", fontWeight:"bold"}} size="large">
          Play Again
        </Button>

        <>
          {panels.map((story, index) => (
            <StoryCard content={story} pWinner={playerWinner==index} cWinner={commWinner==index}/>
          ))}
        </>
      </Box>
    </div>
  )
}

export default GameResult;
