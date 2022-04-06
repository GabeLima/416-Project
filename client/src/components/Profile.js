import React from 'react';
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { Grid } from '@mui/material';


// TODO add following functionality
const FollowButton = (props) => {
    const {isFollowing} = props;
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
    let isFollowing = false;

    // if the viewer is the user
    let isOwner = false;

    // implement a list of cards of completed games
    let cards = []

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
        <Grid item>
            <Typography variant="h2">{user}'s Profile</Typography>
        </Grid>
    </Grid>

    <Grid 
        container 
        direction="row"
        justifyContent="right"
        alignItems="baseline"
        sx = {{
            px: 4
        }}
    >
        {isOwner ? null : <FollowButton isFollowing={isFollowing}/>}
    </Grid>

        
    <Typography variant="h3">Completed Games</Typography>
    </>
    );
}

export default Profile;