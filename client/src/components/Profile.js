import React, { useState } from 'react';
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import PublishedGameCard from './PublishedGameCard';


// TODO add following functionality
const FollowButton = ({isFollowing, setIsFollowing}) => {
    let follow_text = "";
    if(isFollowing) {
        follow_text = "Unfollow";
    }
    else {
        follow_text = "Follow";
    }
    return (
        <>
        <Button
            color="primary"
            variant="contained"
            sx={{
                px: 5
            }}
            onClick={()=>{
                setIsFollowing(!isFollowing);
            }}
        >{follow_text}</Button>
        </>
    );
};

// Component for the profile page
// Displays profile information for a user
// Profile Name
// Completed Games
// Follow/Unfollow user button
// (follow button only appears if the viewer is not the user)
const Profile = (props) => {
    // viwer is who is viewing the profile
    // user is whose profile is being displayed
    //const {viewer, user} = props;
    let user = "McKilla Gorilla";

    // if the viewer is following the user
    const [isFollowing, setIsFollowing] = useState(false);

    // if the viewer is the user
    let isOwner = false;

    // implement a list of cards of completed games
    const publishedGames = [
        {
            creator:"McKilla Gorilla",
            gameID : "JYGS",
            panels: [
                ["/images/1.png", "/images/2.png", "/images/3.png", "/images/4.png"],
                ["/images/1.png", "/images/1.png", "/images/1.png", "/images/1.png"]
            ],
            communityVotes: [
                ["npc1", "npc2"],
                []
            ],
            comments: [
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
            ],
            tags : ["Unbelievable", "Pokemon", "Digimon", "War"]
        },
        {
            creator:"McKilla Gorilla",
            gameID : "KUGB",
            panels: [
                ["/images/mark_oukan_crown7_blue.png", "/images/4.png", "/images/4.png", "/images/4.png"],
                ["/images/1.png", "/images/1.png", "/images/1.png", "/images/1.png"]
            ],
            communityVotes: [
                [],
                []
            ],
            comments: [
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
                }
            ],
            tags : ["NewPlayer", "Crown"]
        }
    ];

    return (
    <>
    <Grid 
        container 
        direction="row"
        justifyContent="center"
        alignItems="baseline"
        sx = {{
            gap: 2
        }}
    >
        <Grid item pb={2}>
            <Typography variant="h2">{user}'s Profile</Typography>
        </Grid>
    </Grid>

    <Grid 
        container 
        direction="row"
        justifyContent="center"
        alignItems="baseline"
        sx = {{
            px: 4
        }}
    >
        {isOwner ? null : <FollowButton isFollowing={isFollowing} setIsFollowing={setIsFollowing}/>}
    </Grid>

        
    <Typography variant="h3">Completed Games</Typography>
    <Grid container>
        {publishedGames.map(({creator, tags, communityVotes, comments, panels}) => (
            <PublishedGameCard creator={creator} tags={tags} votes={communityVotes} comments={comments} panels={panels}/>
        ))}
    </Grid> 
    </>
    );
}

export default Profile;