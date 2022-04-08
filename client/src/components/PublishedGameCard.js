import { Box, Container, Grid, Typography } from '@mui/material';
import Tags from "./Tags"
import SimpleImageSlider from "react-simple-image-slider";
import React, { useEffect, useState } from 'react'

const PublishedGameCard = ({creator, tags, votes, comments, panels}) => {
   const [numVotes, setNumVotes] = useState(0);
   const [numComments, setNumComments] = useState(0);
   const [commWinner, setCommWinner] = useState(-1);

   useEffect(()=> {
       let count = 0;
       for(let i = 0; i < votes.length; i++)
       {
           count += votes[i].length;
       }

       setNumVotes(count);
       setNumComments(comments.length);
   })

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
  });

  return (
    <Grid item m={2}>
        <Container style={{width:"330px", backgroundColor:"#80B192", borderRadius:"20px"}}>
            <Typography variant="h5" mb={2} pt={1}>
                {creator}
            </Typography>

            {commWinner >= 0 ? <SimpleImageSlider width={280} height={280} showBullets={true} showNavs={true} images={panels[commWinner]} /> : <SimpleImageSlider width={300} height={280} showBullets={true} showNavs={true} images={panels[0]} />}

            <Typography variant="subtitle1" mb={1}>
                Votes: {numVotes}; Comments: {numComments}
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

export default PublishedGameCard
