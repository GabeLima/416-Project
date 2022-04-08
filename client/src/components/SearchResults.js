import { React, useState } from 'react'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Link from '@mui/material/Link';

import { Grid } from '@mui/material';


import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import PublishedGameCard from "./PublishedGameCard";

const SearchResults = (props) => {

    // TODO : REMOVE
    // TODO - Props will only have either userResults OR gameResults
    const publishedGames = [
        {
            creator:"gabe",
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
            creator:"david",
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
    const propsHardcoded = {
        currentUser: "Aoi",
        query: "Comedy, Family-Friendly"
    };

    // TODO : REMOVE ABOVE

    let isUserSearch = true;
    let results;
    if (propsHardcoded.userResults) {
        // user search
        results = propsHardcoded.userResults;
    }
    else {
        // game search
        results = propsHardcoded.gameResults;
        isUserSearch = false;
    }

    const currentUser = propsHardcoded.currentUser; // TODO - maybe we use the global store to get this?
    const query = propsHardcoded.query;


    const currentSortType = {
        PUB_NEW: "PUB_NEW",
        PUB_OLD: "PUB_OLD",
        COMMENTS_ASC: "COMMENTS_ASC",
        COMMENTS_DESC: "COMMENTS_DESC"
    };

    const [anchorEl, setAnchorEl] = useState(null);

    const isMenuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event) => {
        setAnchorEl(null);
        console.log("Sort By: " + event.target.textContent);
        switch (event.target.textContent) {
            // Sort accordingly
            case "Publish Date (Newest)":
                break;
            case "Publish Date (Oldest)":
                break;
            case "Number of Comments (Descending)":
                break;
            case "Number of Comments (Ascending)":
                break;
            default:
                console.log("Sort menu closed");
                break;
        }
    };

    const pubNewOption = (<MenuItem onClick={handleMenuClose}>Publish Date (Newest)</MenuItem>);
    const pubOldOption = (<MenuItem onClick={handleMenuClose}>Publish Date (Oldest)</MenuItem>);

    const moreCommentsOption = (<MenuItem onClick={handleMenuClose}>Number of Comments (Descending)</MenuItem>); // descending
    const lessCommentsOption = (<MenuItem onClick={handleMenuClose}>Number of Comments (Ascending)</MenuItem>); // ascending

    // TODO - implement highlighted sort option when we implement the store (see AppBar.js)
    const menuId = "sort-menu";
    const renderMenu = (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          id={menuId}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          {pubNewOption}
          {pubOldOption}
          {moreCommentsOption}
          {lessCommentsOption}
        </Menu>
    );


    // we don't need the cards just return a list of users
    if (isUserSearch) {
        return (
            <div>
                <Box alignItems="center" sx={{ display: {
                    backgroundColor: "#6A8D92",
        
                } }}>
        
                    <Typography variant="h2"
                                noWrap
                                component="div"
                                align="center">
                            {"Search Results For: " + query}
                    </Typography>

                    <List sx={{
                                marginTop:2,
                                marginLeft: 85,
                                justifyContent: "center",
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                overflow: "auto",
                                maxHeight:"750px",
                                width: "600px"
                            }}>
                        {results.map((user, i) => {
                            return (
                                <ListItem
                                    key={i}
                                    sx={{ marginTop: '5px',bgcolor: "#4b4e6d", height:"65px", minWidth:"100px", maxWidth:"500px"}}
                                    style={{
                                        fontSize: '24pt',
                                        width: '500%',
                                        borderRadius: "15px",
                                        justifyContent: "center",
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        borderRadius: "20px",
                                        borderStyle: "solid",
                                        borderWidth: "3px",
                                        borderColor: "#80b192"
                                    }}>
                                        <Link underline="none" href={"/" + user}>
                                            <Typography variant="h4"
                                                        noWrap
                                                        component="div"
                                                        color={ "#A1E887"}>
                                                {user}
                                            </Typography>
                                        </Link>
                                </ListItem>
                            );                    
                        })}
                    </List>
                    
                    <Box sx= {{ height: 700}}/>
                </Box>
            </div>
        );
    }
    else {
        return (
            <Box className="back" pb={4}>
                <Typography align="center" variant="h2">{"Search Results For: " + query}</Typography>
                <Grid 
                    container 
                    direction='row'
                >
                    <Grid item xs={10}>
    
                        {
                            <Grid container>
                                {publishedGames.map(({creator, tags, communityVotes, comments, panels}) => (
                                    <PublishedGameCard creator={creator} tags={tags} votes={communityVotes} comments={comments} panels={panels}/>
                                ))}
                            </Grid>
                        }
                    </Grid>
                </Grid>
    
            </Box>
        );
    }
}


export default SearchResults;
