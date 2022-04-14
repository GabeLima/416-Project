import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import PublishedGameCard from './PublishedGameCard';

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
            color="primary"
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


    // viwer is who is viewing the profile
    
    useEffect(() => {
        // user is whose profile is being displayed
        //const {viewer, user} = props;
        if(!rendered){
            const callGetUser = async() => {
                return await api.getUser(user).then((response) => {
                    return response.data.user;
                }).then((userI) => {
                    console.log(userI);
                    setUserInfo(userI);
                });
            }
            callGetUser();
            setRendered(true);
        }
    }, [rendered, userInfo, user, setIsFollowing]);


    useEffect(() => {
        if(userInfo && auth.user){
            console.log(userInfo);
            console.log(auth);
            //Checks if the user has followed the profile yet
            if(userInfo.followers.indexOf(auth.user.email) > -1){
                setIsFollowing(true);
            }

            //Checks if the viewer of page is owner of page
            if(auth.user.email === userInfo.email){
                setIsOwner(true);
            }
        }
    }, [setIsFollowing, setIsOwner, userInfo, auth])

    // implement a list of cards of completed games
    const publishedGames = [
        {
            creator:"vicchan",
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
            creator:"victor",
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
        {isOwner ? null : <FollowButton isFollowing={isFollowing} setIsFollowing={setIsFollowing} userInfo={userInfo} auth={auth}/>}
    </Grid>

        
    <Typography variant="h3">Completed Games</Typography>
    <Grid container className='back'>
        {publishedGames.map(({creator, tags, communityVotes, comments, panels}) => (
            <PublishedGameCard creator={creator} tags={tags} votes={communityVotes} comments={comments} panels={panels}/>
        ))}
    </Grid> 
    </>
    );
}

export default Profile;