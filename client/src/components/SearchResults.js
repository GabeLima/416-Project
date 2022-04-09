import { React, useState, useContext, useEffect } from 'react'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Link from '@mui/material/Link';

import { Grid } from '@mui/material';


import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import PublishedGameCard from "./PublishedGameCard";

import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import api from '../api'

const SearchResults = (props) => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState("");
    const [isUserSearch, setIsUserSearch] = useState(true);

    useEffect(() => {
        
        let query = store.searchQuery;
        console.log(query);
        if (query.indexOf(",") === -1 && query.indexOf("u:") !== -1) {
            // no comma and u: means user search
            setIsUserSearch(true);
        }
        else {
            setIsUserSearch(false);
        }
        setQuery(query);
        search(query);
    }, [store.searchQuery]);

    const search = async (query) => {
        if (query.indexOf(",") === -1) {
            // check if this is a tag or user query since a length 1 query can be either or.
    
            if (query.indexOf("u:") === -1) {
                // tag means game search.
                let res = await api.searchGames(query);
                if (res.data.success) {
                    let results = res.data.data;
                    console.log(res.data)
                    console.log("games found");
                    console.log(results);
                    setResults(results);
                }
                else {
                    setResults([]);
                }
            }
            else {
                // one user search means user search. we need to sanitize and get the username from this.
                let username = query.split("u:")[1];
                let res = await api.getUser(username);
                if (res.data.success) {
                    let results = res.data.user;
                    console.log("user found");
                    console.log(results);
                    let arr = [results];
                    setResults(arr);
                }
                else {
                    setResults([]);
                }
            }
        }
    
        else {
            // multi-part game search
            let res = await api.searchGames(query);
            if (res.data.success) {
                if (res.data.success) {
                    let results = res.data.data;
                    console.log("games found");
                    console.log(results);
                    setResults(results);
                }
                else {
                    setResults(results);
                }
            }
        }
    
    }
    

    console.log(results);
    console.log(isUserSearch);
    let currentUser = auth.user;
    
    
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
    if (isUserSearch) {
        const renderMenu = "";
    }
    else {
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
    }
    


    // we don't need the cards just return the user
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
                                        <Link underline="none" href={"/" + user.username}>
                                            <Typography variant="h4"
                                                        noWrap
                                                        component="div"
                                                        color={ "#A1E887"}>
                                                {user.username}
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
                                {results.map(({creator, tags, communityVotes, comments, panels}) => (
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
