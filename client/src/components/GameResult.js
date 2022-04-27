import { Avatar, Box, Button, Container, Grid, TextField, Typography, useTheme } from '@mui/material';

import React, { useEffect, useState } from 'react'
import StoryCard from './StoryCard';
import GameComment from './GameComment';
import { useLocation } from 'react-router-dom';
import api from '../api'
import { useHistory } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../auth'

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

// Page viewed after clicking on a completed game card

const GameResult = () => {

  const location = useLocation();

  const { auth } = useContext(AuthContext);
  const [comics, setComics] = useState([]);
  const [game, setGame] = useState();
  let history = useHistory();

  const getGame = async (gameID) => {
    let res = await api.getGame(gameID);
    if (res.data.success) {
      let gameRes = res.data.game;
      console.log("Game found");
      console.log(gameRes);
      setGame(gameRes);

      if (gameRes.isComic) {
        let newComics = [...comics];
        for (let i = 0; i < gameRes.panels.length; i++) {
          let panels = gameRes.panels[i];
          let res = await api.getImage({panels : panels})
          if (res.data.success) {
            let comic = res.data.image;
            newComics.push(comic);
          }
          }
  
        console.log("New Comics:");
        console.log(newComics);
  
        setComics(newComics);
      }
      else {
        let newComics = [...comics];
        for (let i = 0; i < gameRes.panels.length; i++) {
          let panels = gameRes.panels[i];
          let res = await api.getText({panels : panels})
          if (res.data.success) {
            let comic = res.data.text;
            newComics.push(comic);
          }
        }
  
        console.log("New Stories:");
        console.log(newComics);
  
        setComics(newComics);
        }
      }
    }
  const handleClick = (pageURL) => {
    console.log(pageURL);
    history.push(pageURL);
  };

  useEffect(() => {
    let gameID = location.pathname.split("gameResult/")[1];
    getGame(gameID);
  }, []);


  let panels = comics;
  let winnerVotes = 0;
  let winnerIndex = 0;
  let cards = "";
  let communityVotes,comments;
  if (game) {
    communityVotes = game.communityVotes;
    comments = game.comments;
    communityVotes.forEach((subset, i) => {
      if (subset.length > winnerVotes) {
        winnerVotes = subset.length;
        winnerIndex = i;
      }
    });

    // determine what type of carousel to show the user
    if (game.isComic) {
      cards = (panels.map((story, i) => {
        return <StoryCard key={i} content={story} winner={winnerIndex===i}/>
      }));
    }
    else {
      cards = (panels.map((story, i) => {
        return (
          <div>
            <SlideshowCard key={i} content={story} winner={winnerIndex===i}/>
          </div>
        );
      }));
    }
  }
  else {
    communityVotes = [];
    comments = [];
  }


  console.log("panel");
  console.log(panels);

  const theme = useTheme();
  return (
    <div className='back'>
      <Box textAlign='center' mt={5} className="Game" >
        <Button variant="outlined" disabled={!auth.loggedIn} style={{backgroundColor: theme.button.bg, color: theme.button.text, fontWeight:"bold"}} size="large" onClick={() => handleClick('/create')}>
          Play Again
        </Button>

        <>
          { cards }
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

const SlideshowCard = ({content, winner}) => {
  console.log(content);
  return (
    <Grid container justifyContent="center" alignItems="center" columnSpacing={4} mt={5}>
        <Grid item xs={1}>
            {winner ? <img width="100%" src="/images/mark_oukan_crown7_blue.png" alt="commVoteCrown"></img> : ''}
        </Grid>
        <Grid item xs={6} className="slideshowResult" >
            <Slideshow stories={content}/>
        </Grid>
        <Grid item xs={1}>
            <Button variant="outlined" size="large" startIcon={<Avatar src={"/images/heart_blur.png"}></Avatar>}>Vote</Button>
        </Grid>
    </Grid>
  )
}
  
const Slideshow = (stories) => {
  console.log(stories);
  const text = stories.stories;
  return (
    <Carousel autoPlay={true} infiniteLoop={true} showStatus={false}>

      {
        text.map((story) => {
          return (
            <div className='padding'>
              <div className="carousel-item" dangerouslySetInnerHTML={{__html: story}} />
            </div>
          );
        })
      }
    </Carousel>
  );
}

export default GameResult;
