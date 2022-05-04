import { Avatar,  Button, Grid } from '@mui/material';
import SimpleImageSlider from "react-simple-image-slider";

import React from 'react'

const StoryCard = ({content, winner, voted, voteHandler, index}) => {
  return (
    <Grid container justifyContent="center" alignItems="center" columnSpacing={4} mt={5}>
        <Grid item xs={1}>
            {winner ? <img width="100%" src="/images/mark_oukan_crown7_blue.png" alt="commVoteCrown"></img> : ''}
        </Grid>
        <Grid item xs={6} className="slider">
            <SimpleImageSlider width={600} height={280} showBullets={true} showNavs={true} images={content} style={{marginLeft:"10%"}}/>
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

export default StoryCard
