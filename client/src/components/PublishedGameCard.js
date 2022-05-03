import { Button, Container, Grid, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Tags from "./Tags"
import SimpleImageSlider from "react-simple-image-slider";
import React, { useEffect, useState, useContext, useRef } from 'react'
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth';
import { useTheme } from '@mui/material';
import { GlobalStoreContext } from '../store'

import api from '../api';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import "../StoryCard.css";

const PublishedGameCard = ({creator, tags, votes, comments, panels, isComic, gameID, deleteCard}) => {
  const { store } = useContext(GlobalStoreContext);
   const { auth } = useContext(AuthContext);
   const [numVotes, setNumVotes] = useState(0);
   const [numComments, setNumComments] = useState(0);
   const [commWinner, setCommWinner] = useState(-1);
   const [isOwner, setIsOwner] = useState(false);
   const [panelURLs, setPanelURLs] = useState([]);
   const [panelSet, setPanelSet] = useState(false);
   let history = useHistory();

  function deleteGame(){
      store.handleDelete(gameID, deleteCard);
      //await api.deleteGame(gameID);
      //deleteCard(gameID);
      //return;
   }


   useEffect(()=> {
       let count = 0;
       for(let i = 0; i < votes.length; i++)
       {
           count += votes[i].length;
       }

       setNumVotes(count);
       setNumComments(comments.length);
   }, [comments.length, votes]);

   useEffect(() => {
    let max = -1;
    let win = -1;

    for(let i = 0; i < votes.length; i++)
    {
      if(votes[i].length > max){
        max = votes[i].length;
        win = i;
      }
    }

    setCommWinner(win);
    // console.log(commWinner);
  }, [votes]);

  useEffect(() => {
      if(auth.user && auth.user.username === creator){
        setIsOwner(true);
      }
      else{
        setIsOwner(false);
      }
  }, [auth])

  //Changing pannels to urls
  useEffect(() => {
    if(isComic && !panelSet){
      let temp = [];

      const getImage = async(panels) => {
        return await api.getImage({panels : panels})
        .then((response) => {
          console.log(response.data.image);
          return response.data.image;
        }).then((image) => {
          console.log("Set panel urls");
          setPanelURLs(image);
          setPanelSet(true);
        });
      }

      getImage(panels);


      // console.log("TEmp: ", temp);
    }
    else if (!isComic && !panelSet) {
      let temp = [];

      const getText = async(panels) => {
        return await api.getText({panels : panels})
        .then((response) => {
          console.log(response.data.text);
          return response.data.text;
        }).then((text) => {
          console.log("Set panel urls");
          setPanelURLs(text);
          setPanelSet(true);
        });
      }

      getText(panels);
    }
  }, [panels, isComic, panelURLs, panelSet]);



  const theme = useTheme();

  let cards = "";

  // comic cards
  if (isComic) {
    if (panelSet && panelURLs!==undefined) {
      if (commWinner >= 0) {
        cards = (<SimpleImageSlider width={280} height={280} showBullets={true} showNavs={true} images={panelURLs[commWinner]} />);
      }
      else {
        cards = (<SimpleImageSlider width={280} height={280} showBullets={true} showNavs={true} images={[...panelURLs[0]]} />);
      }
    }
  }

  // story cards
  else {
    if (panelSet && panelURLs!==undefined) {
      if (commWinner >= 0) {
        cards = (
          <div className="slideshow">
            <Slideshow stories={panelURLs[commWinner]} />
          </div>
        );
      }
      else {
        cards = (
          <div className="slideshow">
            <Slideshow stories={[...panelURLs[0]]} />
          </div>
        );
      }
    }
  }
  return (
    <Grid item m={2}>
        <Container style={{width:"330px", backgroundColor: theme.card.game.bg, borderRadius:"20px"}}>
            <Grid container>
              <Grid item xs={9}>
                {isOwner ? 
                  <IconButton color='error' aria-label="delete" mb={2} pt={1} onClick={deleteGame}>
                    <DeleteIcon />
                  </IconButton> : 
                  <Typography variant="h5" mb={2} pt={1}>
                  {creator}
                </Typography>
                }
              </Grid>
              <Grid item pt={1}>
                <Button 
                style={{backgroundColor: theme.card.game.button, color:"black"}}
                onClick={()=>{
                  history.push(`/gameResult/${gameID}`)
                }}
                >Visit</Button>
              </Grid>
            </Grid>


            {cards}


            <Typography variant="subtitle1" mb={1}>
                Votes: {numVotes}; Comments: {numComments}
            </Typography>

            <Grid container spacing={1} pb={2} sx={{overflow:"auto"}}>
                {tags.map((tag, i) => (
                    <Tags key={i} tag={tag}/>
                ))}
            </Grid>
        </Container>
    </Grid>
  )
}

const Slideshow = (stories) => {
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

export default PublishedGameCard
