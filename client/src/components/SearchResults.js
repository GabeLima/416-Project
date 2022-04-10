import { React, useState, useContext, useEffect } from 'react'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import SortIcon from '@mui/icons-material/Sort';

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
    const [currentSort, setCurrentSort] = useState(null);

    useEffect(() => {
        
        let query = store.searchQuery;
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
    
    let currentUser = auth.user;
    
    let isComic = store.isComic;
    
    let filteredResults = results.filter((game) => {
        if (game.isComic === isComic) {
            return true;
        }
        else {
            return false;
        }
    });

    const currentSortType = {
        PUB_NEW: "PUB_NEW",
        PUB_OLD: "PUB_OLD",
        COMMENTS_DESC: "COMMENTS_DESC",
        COMMENTS_ASC: "COMMENTS_ASC",
        VOTES_DESC: "VOTES_DESC",
        VOTES_ASC: "VOTES_ASC"
    };

    const [anchorEl, setAnchorEl] = useState(null);

    const isMenuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event) => {
        setAnchorEl(null);
        if (event.target.textContent === currentSort) {
            setCurrentSort(null);
            console.log("Cancel sort");
            return;
        }
        console.log("Sort By: " + event.target.textContent);
        console.log(filteredResults);
        switch (event.target.textContent) {
            // Sort accordingly
            case "Publish Date (Newest)":
                setCurrentSort(currentSortType.PUB_NEW);
                filteredResults.sort((x, y) => {
                    let x_date = new Date(x.createdAt);
                    let y_date = new Date(y.createdAt);
                    if (x_date < y_date) {
                        return 1;
                    }
                    else if (x_date > y_date) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                });
                break;

            case "Publish Date (Oldest)":
                setCurrentSort(currentSortType.PUB_OLD);
                filteredResults.sort((x, y) => {
                    let x_date = new Date(x.createdAt);
                    let y_date = new Date(y.createdAt);
                    if (x_date < y_date) {
                        return -1;
                    }
                    else if (x_date > y_date) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
                break;

            case "Number of Comments (Descending)":
                setCurrentSort(currentSortType.COMMENTS_DESC);
                filteredResults.sort((x, y) => {
                    if (x.comments.length < y.comments.length) {
                        return 1;
                    }
                    else if (x.comments.length > y.comments.length) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                });
                break;

            case "Number of Comments (Ascending)":
                setCurrentSort(currentSortType.COMMENTS_DESC);
                filteredResults.sort((x, y) => {
                    if (x.comments.length < y.comments.length) {
                        return -1;
                    }
                    else if (x.comments.length > y.comments.length) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
                break;

            case "Number of Votes (Descending)":
                setCurrentSort(currentSortType.VOTES_DESC);
                filteredResults.sort((x, y) => {
                    let x_votes = 0;
                    let y_votes = 0;

                    x.communityVotes.forEach((arr) => {x_votes += arr.length});
                    y.communityVotes.forEach((arr) => {y_votes += arr.length});

                    if (x_votes < y_votes) {
                        return 1;
                    }
                    else if (x_votes > y_votes) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                });
                break;
            case "Number of Votes (Ascending)":
                setCurrentSort(currentSortType.VOTES_ASC);
                filteredResults.sort((x, y) => {
                    let x_votes = 0;
                    let y_votes = 0;

                    x.communityVotes.forEach((arr) => {x_votes += arr.length});
                    y.communityVotes.forEach((arr) => {y_votes += arr.length});

                    if (x_votes < y_votes) {
                        return -1;
                    }
                    else if (x_votes > y_votes) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
                break;
            default:
                console.log("Sort menu closed");
                break;
        }
        setResults(filteredResults);
        console.log(filteredResults);
    };

    let pubNewOption = (<MenuItem onClick={handleMenuClose}>Publish Date (Newest)</MenuItem>);
    let pubOldOption = (<MenuItem onClick={handleMenuClose}>Publish Date (Oldest)</MenuItem>);

    let moreCommentsOption = (<MenuItem onClick={handleMenuClose}>Number of Comments (Descending)</MenuItem>); // descending
    let lessCommentsOption = (<MenuItem onClick={handleMenuClose}>Number of Comments (Ascending)</MenuItem>); // ascending

    let moreVotesOption = (<MenuItem onClick={handleMenuClose}>Number of Votes (Descending)</MenuItem>); // descending
    let lessVotesOption = (<MenuItem onClick={handleMenuClose}>Number of Votes (Ascending)</MenuItem>); // ascending

    switch (currentSort) {
        case currentSortType.PUB_NEW:
            pubNewOption = (<MenuItem selected onClick={handleMenuClose}>Publish Date (Newest)</MenuItem>);
            break;
        case currentSortType.PUB_OLD:
            pubOldOption = (<MenuItem selected onClick={handleMenuClose}>Publish Date (Oldest)</MenuItem>);
            break;
        case currentSortType.COMMENTS_DESC:
            moreCommentsOption = (<MenuItem selected onClick={handleMenuClose}>Number of Comments (Descending)</MenuItem>); // descending
            break;
        case currentSortType.COMMENTS_ASC:
            lessCommentsOption = (<MenuItem selected onClick={handleMenuClose}>Number of Comments (Ascending)</MenuItem>); // ascending
            break;
        case currentSortType.VOTES_DESC:
            moreVotesOption = (<MenuItem selected onClick={handleMenuClose}>Number of Votes (Descending)</MenuItem>); // descending
            break;
        case currentSortType.VOTES_ASC:
            lessVotesOption = (<MenuItem selected onClick={handleMenuClose}>Number of Votes (Ascending)</MenuItem>); // ascending
            break;
        default:
            break;
    }

    
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
            {moreVotesOption}
            {lessVotesOption}
        </Menu>
    );
    


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
                        {filteredResults.map((user, i) => {
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
                <Box display="flex" alignItems="flex-start" justifyContent="center">
                    <Typography
                        align="center"
                        variant="h5"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' }}}
                        color="black"
                        marginTop="6px"
                    >
                        Sort By:
                    </Typography>

                    <IconButton
                    align="center"
                    size="large"
                    edge="end"
                    aria-label="Sort Menu"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                    color="default"
                    >
                        <Badge>
                            <SortIcon />
                        </Badge>
                    </IconButton>
                    {renderMenu}
                </Box>
                <Grid 
                    container 
                    direction='row'
                >
                    <Grid item xs={10}>
    
                        {
                            <Grid container>
                                {filteredResults.map(({creator, tags, communityVotes, comments, panels}, i) => (
                                    <PublishedGameCard key={i} creator={creator} tags={tags} votes={communityVotes} comments={comments} panels={panels}/>
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
