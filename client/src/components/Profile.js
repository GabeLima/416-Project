import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography';
import { CssBaseline, Grid } from '@mui/material';
import PublishedGameCard from './PublishedGameCard';
import Box from '@mui/material/Box';

import AuthContext from '../auth';
import api from '../api'
import { useContext, useEffect } from 'react';


// TODO add following functionality
const FollowButton = ({isFollowing, setIsFollowing, userInfo, auth}) => {
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
            color="secondary"
            variant="contained"
            sx={{
                px: 5
            }}
            onClick={async()=>{
                //not following will turn into following
                if(!isFollowing){
                    if(userInfo){
                        //update followers
                        userInfo.followers.push(auth.user.email);
                        await api.updateFollowers({
                            email : userInfo.email,
                            followers : userInfo.followers
                        });

                        //Update following
                        auth.user.following.push(userInfo.email);
                        await api.updateUser({
                            email : auth.user.email,
                            following : auth.user.following
                        }).then(() => {
                            auth.getLoggedIn();
                        });
                    }
                }
                else{                       //Unfollowing so remove from list
                    //update followers
                    let removedI = userInfo.followers.indexOf(auth.user.email);
                    if(removedI > -1){
                        userInfo.followers.splice(removedI, 1);
                        await api.updateFollowers({
                            email : userInfo.email,
                            followers : userInfo.followers
                        });
                    }

                    //update Following
                    removedI = auth.user.following.indexOf(userInfo.email);
                    if(removedI > -1){
                        auth.user.following.splice(removedI, 1);
                        await api.updateUser({
                            email : auth.user.email,
                            following : auth.user.following
                        }).then(() => {
                            //Only updating auth cause there is no need to update userInfo that only renders upon visiting the page
                            auth.getLoggedIn();
                        });
                    }
                }
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
    const { auth } = useContext(AuthContext);
    const params = useParams();
    const [isFollowing, setIsFollowing] = useState(false);
    const [userInfo, setUserInfo] = useState();
    //If viewer is owner
    const [isOwner, setIsOwner] = useState(false);

    let user = params.username;
    const [rendered, setRendered] = useState(false);

    const [publishedGames, setPublishedGames] = useState([]);


    // viwer is who is viewing the profile
    
    useEffect(() => {
        // user is whose profile is being displayed
        //const {viewer, user} = props;
        if(!rendered){
            const callGetUser = async() => {
                return await api.getUser(user).then((response) => {
                    return response.data.user;
                }).then((userI) => {
                    //console.log(userI);
                    setUserInfo(userI);
                });
            }
            callGetUser();
            setRendered(true);
        }
    }, [rendered, userInfo, user, setIsFollowing]);


    useEffect(() => {
        if(userInfo && auth.user){
            //console.log(userInfo);
            //console.log(auth);
            //Checks if the user has followed the profile yet
            if(userInfo.followers.indexOf(auth.user.email) > -1){
                setIsFollowing(true);
            }

            //Checks if the viewer of page is owner of page
            if(auth.user.email === userInfo.email){
                setIsOwner(true);
            }
        }

        if(userInfo){
            const getUserGames = async() => {
                api.searchGames(`u:${userInfo.username}`).then((response) => {
                    return response.data.data;
                }).then((data) => {
                    //console.log(data);
                    setPublishedGames(data);
                    return data;
                })
            }

            getUserGames();
        }
    }, [setIsFollowing, setIsOwner, userInfo, auth])

    function deleteCard(id){
        //console.log("Deleting Card: ", id);
        //console.log(publishedGames.filter(g => g.gameID != id));
        setPublishedGames(publishedGames.filter(g => g.gameID != id));
    }


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
        {isOwner ? null : <FollowButton isFollowing={isFollowing} setIsFollowing={setIsFollowing} userInfo={userInfo} auth={auth}/>}
    </Grid>

        
    <Typography variant="h3">Completed Games</Typography>
    <Grid container className='back'>
        {publishedGames.map(({creator, tags, communityVotes, comments, panels, isComic, gameID}, i) => (
            <PublishedGameCard key={gameID} creator={creator} tags={tags} votes={communityVotes} comments={comments} panels={panels} isComic={isComic} gameID={gameID} deleteCard={deleteCard}/>
        ))}
    </Grid> 
    </>
    );
}

export default Profile;