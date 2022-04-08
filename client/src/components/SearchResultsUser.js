import { React, useState } from 'react'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Link from '@mui/material/Link';

import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import SortIcon from '@mui/icons-material/Sort';

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

// TODO - REMOVE. THIS IS PURELY FOR PURPOSES OF CHECKPOINT 2.

const SearchResultsUser = (props) => {

    // TODO : REMOVE
    // TODO - Props will only have either userResults OR gameResults
    const propsHardcoded = {
        currentUser: "aoi",
        query: "u:mckenna",
        userResults: ["McKenna"]
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
                    
                    <Box sx= {{ height: 200}}/>
                </Box>
            </div>
        );
    }
    else {
        // TODO- @Vicky need content cards
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

                    

                    <Box display="flex" alignItems="flex-start" justifyContent="center" gap="10px">

                        <Typography variant="h6"
                                    noWrap
                                    component="div"
                                    align="center"
                                    sx={{marginTop:1}}
                        >
                            Sort By
                        </Typography>

                        <IconButton
                            edge="end"
                            aria-label="Sort Menu"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleMenuOpen}
                            color="default"
                            >
                                <Badge>
                                    <SortIcon  sx={{ fontSize: 40 }}/>
                                </Badge>
                        </IconButton>

                        {renderMenu}
                    </Box>
                    

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
                        {results.map((game, i) => {
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
                                        <Link underline="none" href={"/" + game}>
                                            <Typography variant="h4"
                                                        noWrap
                                                        component="div"
                                                        color={ "#A1E887"}>
                                                {game}
                                            </Typography>
                                        </Link>
                                </ListItem>
                            );                    
                        })}
                    </List>
                    
                    <Box sx= {{ height: 200}}/>
                </Box>
            </div>
        );
    }
}


export default SearchResultsUser;
