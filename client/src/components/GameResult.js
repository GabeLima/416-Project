import { Avatar, Box, Button, Container, Grid, TextField, Typography, useTheme } from '@mui/material';

import React, { useEffect, useState } from 'react'
import StoryCard from './StoryCard';
import GameComment from './GameComment';
import { useLocation, useParams } from 'react-router-dom';
import api from '../api'
import { useHistory } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

// Page viewed after clicking on a completed game card

const GameResult = () => {

  const location = useLocation();
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const params = useParams();
  let id = params.id;
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
  // let winnerIndex = 0;
  let cards = "";
  // let communityVotes;
  const [communityVotes, setCommunityVotes] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentField, setCommentField] = useState("");
  const [votedFor, setVotedFor] = useState(-1);
  const [winnerIndex, setWinner] = useState([]);

  const vote = async(votedStory)=>{
    if(!auth.user){
      console.log("Please login");
      store.setErrorMessage("Please login");
      return;
    }
    if(votedStory != undefined)                   //Player submited a vote
    {
        //Remove vote if already present
        let cVotes = [...communityVotes];
        console.log("Votes: ", cVotes);
        console.log(communityVotes);
        for(let i = 0; i < cVotes.length; i++)
        {
            let removedI = cVotes[i].indexOf(auth.user.email);
            if(removedI > -1)
            {
                cVotes[i].splice(removedI, 1);
                break;
            }
        }

        //Check if user is voting or unvoting
        if(votedStory == votedFor){
          setVotedFor(-1);
          try{
            await api.updateGame({
              gameID : id,
              communityVotes : -1,
              email : auth.user.email,
              unVote : true
            });
          }
          catch(err){
            store.setErrorMessage("Error happened on server.");
          }
        }else{
          cVotes[votedStory].push(auth.user.email);
          setVotedFor(votedStory);
          try{
            await api.updateGame({
              gameID : id,
              communityVotes : votedStory,
              email : auth.user.email,
              unVote : false
            });
          }
          catch(err){
            store.setErrorMessage("Error happened on server.");
          }
        }
        setCommunityVotes(cVotes);
    }
  }

  useEffect(()=>{ //in a seperate useEFfect so it only runs once even if a state changes
    if(game){
      console.log("Votes:", communityVotes);
      if(game.communityVotes.length == 0){
        let cVotes = [];
        for(let i = 0; i < game.panels.length; i++){
          cVotes.push([]);
        }
        setCommunityVotes(cVotes);
      }else{
        setCommunityVotes(game.communityVotes);
      }
      setComments(game.comments);
    }
  }, [game])

  useEffect(()=>{
    if (game) {
      let winnerVotes = 0;
      let winner = [];
      communityVotes.forEach((subset, i) => {
        if(auth.user && subset.includes(auth.user.email)){
          setVotedFor(i);
        }

        if (subset.length > winnerVotes) {
          winnerVotes = subset.length;
          // winner = i;
        }
      });

      //Final winners
      if(winnerVotes != 0){
        communityVotes.forEach((subset, i) => {
          if (subset.length == winnerVotes) {
            // winnerVotes = subset.length;
            winner.push(i);
          }
        });
      }

      setWinner(winner);
    }
  }, [game, communityVotes])

  if(game){
    // determine what type of carousel to show the user
    if (game.isComic) {
      cards = (panels.map((story, i) => {
        return <StoryCard key={i} content={story} winner={winnerIndex.includes(i)} voted={votedFor===i} voteHandler={vote} index ={i}/>
      }));
    }
    else {
      cards = (panels.map((story, i) => {
        return (
          <div className="slideshow">
            <SlideshowCard key={i} content={story} winner={winnerIndex.includes(i)} voted={votedFor===i} voteHandler={vote} index ={i}/>
          </div>
        );
      }));
    }
  }

  

  // console.log("panel");
  // console.log(panels);

  const makeComment = async(event) => {
    event.preventDefault();
    if(!auth.user){
      console.log("Please login");
      store.setErrorMessage("Please login");
      return;
    }
    const formData = new FormData(event.currentTarget);
    if(!formData.get('comment')){
      store.setErrorMessage("Please type in the comment field");
      return;
    }

    const c = {
      username : auth.user.username,
      email : auth.user.email,
      content : formData.get('comment'),
      postDate : new Date()
    }

    console.log(c);
    // comments.push(c);
    setComments([...comments, c]);
    setCommentField("");                      //Clear out the field once done
    console.log(comments);

    try{
      await api.updateGame({
        gameID : id,
        comments : c
      });
    }
    catch(err){
      store.setErrorMessage("Error happened on server.");
    }
  }

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

        <Container id="comment-space" style={{width:"72%"}} component="form" onSubmit={makeComment} noValidate>
          <TextField id="comment" variant="filled" fullWidth multiline label="Add a comment" name="comment" value={commentField} onChange = {(e)=>{setCommentField(e.target.value)}}></TextField>
          <Grid container justifyContent="right">
            <Grid item mt={2} mb={4}>
              <Button type="submit" style={{backgroundColor: theme.button.bg, color: theme.button.text, fontWeight:"600"}}>Comment</Button>
            </Grid>
          </Grid>
        </Container>

        {comments.map(({username, content, postDate}, i) => (
          <GameComment key={i} username={username} content={content} postDate={postDate}/>
        ))}
      </Box>
    </div>
  )
}

const SlideshowCard = ({content, winner, voted, voteHandler, index}) => {
  console.log(content);
  return (
    <Grid container justifyContent="center" alignItems="center" columnSpacing={4} mt={5}>
        <Grid item xs={1}>
            {winner ? <img width="100%" src="/images/mark_oukan_crown7_blue.png" alt="commVoteCrown"></img> : ''}
        </Grid>
        <Grid item xs={6} className="slider">
            <Slideshow stories={content}/>
        </Grid>
        <Grid item xs={1}>
            {voted ? 
              <Button style={{backgroundColor:"#B6C5D0"}} variant="outlined" size="large" startIcon={<Avatar src={"/images/heart_blur.png"}></Avatar>} onClick={()=>{voteHandler(index);}}>Vote</Button> : 
              <Button variant="outlined" size="large" startIcon={<Avatar src={"/images/heart_blur.png"}></Avatar>} onClick={()=>{voteHandler(index);}}>Vote</Button>
            }
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
            <div className="carousel-item">
              <div dangerouslySetInnerHTML={{__html: story}} />
            </div>
          );
        })
      }
    </Carousel>
  );
}

export default GameResult;
