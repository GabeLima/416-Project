import React from 'react';
import { useContext, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';

import ColorLensIcon from '@mui/icons-material/ColorLens';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

import { styled, alpha} from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
import { 
    AppBar, Box, Toolbar, IconButton, Typography, 
    InputBase, MenuItem, Menu, Tooltip, Avatar, 
    Button,ToggleButton, ToggleButtonGroup, ListItemIcon,
} from '@mui/material';


    // Button that has logo and routes to the homepage
    const HomeButton = () => {
        let history = useHistory();
        return (
        <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => history.push('/')}
            startIcon={<HomeIcon />}
            size="large"
        >
            <Typography>DERIT</Typography>
        </Button>
        );
    };

    const LoginButton = () => {
        let history = useHistory();
        return(
        <>
        <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => history.push('/login')}
            startIcon={<LoginIcon />}
            size="large"
        >
        Login
        </Button>
        </>
        )
    }

    // Switch between comic/story site
    const SiteToggle = () => {
        const [alignment, setAlignment] = React.useState('comic');
        const handleChange = (event, newAlignment) => {
            if(newAlignment !== null) {
                setAlignment(newAlignment);
            }
        };
        return (
        <ToggleButtonGroup 
            exclusive 
            onChange={handleChange}
            value={alignment}
            sx = {{
                px: 2
            }}
        >
            <ToggleButton color="secondary" value="comic">
                <ColorLensIcon />
                <Typography><strong>Comic</strong></Typography>
            </ToggleButton>
            <ToggleButton color="secondary" value="story">
                <AutoStoriesIcon />
                <Typography><strong>Story</strong></Typography>
            </ToggleButton>
        </ToggleButtonGroup>
        );
    };

    
      
    // TODO route text to search
    const SearchBar = () => {
        let history = useHistory();

        const handleKeyPress = (event) => {
            if (event.code === "Enter") {
                event.stopPropagation();
                event.preventDefault();
                // Pass off to the search handler.
                //store.handleSearch(event.target.value); // TODO- this is how we did it in 316 using the store, we'll see if we still need to.
    
                // todo - do better checking this is lazy and error prone.
                if (event.target.value.indexOf(",") === -1 && event.target.value.substring(0, 2) === "u:") {
                    // singular user search
                    history.push("/search_user");
                }
                else {
                    history.push("/search");
                }
                
            }
        }
        // search components from mui documentation
        const Search = styled('div')(({ theme }) => ({
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: alpha(theme.palette.common.white, 0.15),
                '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.25),
                },
            marginRight: theme.spacing(2),
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
            },
        }));

        const SearchIconWrapper = styled('div')(({ theme }) => ({
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'background.main'
        }));

        const StyledInputBase = styled(InputBase)(({ theme }) => ({
            color: 'secondary', '& .MuiInputBase-input': {
                padding: theme.spacing(1, 1, 1, 0),
                // vertical padding + font size from searchIcon
                paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                transition: theme.transitions.create('width'),
                width: '100%',
                [theme.breakpoints.up('md')]: {
                    width: '20ch',
                },
            },
        }));

        return (
            <Search>
              <SearchIconWrapper>
                <SearchIcon style={{color: "#EEEFF"}}/>
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search DERIT"
                inputProps={{ 'aria-label': 'search' }}
                onKeyPress={handleKeyPress}
              />
            </Search>
        );
    };

    // Contains menu dropdown and routes for
    // View Profile, Account Settings, Logout
    // TODO handle the logout and newGame route 
    const AccountDropdown = ({loggedIn, setLoggedIn}) => {
        let history = useHistory();
        const [anchorElUser, setAnchorElUser] = React.useState(null);

        const handleOpenUserMenu = (event) => {
            setAnchorElUser(event.currentTarget);
        };

        // closes the menu or routes to a new page
        const handleMenuClick = (pageURL) => {
            // closes the menu
            setAnchorElUser(null);
            // routes to a new page
            console.log(pageURL);
            history.push(pageURL);
        };

        return (
            <>
                <Tooltip title="Account Settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar alt="Gorilla Mckilla" fontsize="small"/>
                    </IconButton>
                </Tooltip>

                <Menu
                sx={{ mt: '45px' }}
                id="user-menu"
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={() => setAnchorElUser(null)}
                getContentAnchorEl={null}
                  transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'left', vertical: 'Bottom' }}
                >
                    <MenuItem onClick={() => handleMenuClick('/profile')}>
                        <ListItemIcon>
                            <Avatar sx={{ height: '25px', width: '25px' }}/>
                        </ListItemIcon>
                        Profile
                    </MenuItem>
                    
                    <MenuItem onClick={() => handleMenuClick('/account')}>
                        <ListItemIcon>
                            <Settings fontsize="small" />
                        </ListItemIcon>
                        Account Settings
                    </MenuItem>

                    <MenuItem onClick={() => handleMenuClick('/create')}>
                        <ListItemIcon>
                            <AddIcon fontsize="small" />
                        </ListItemIcon>
                        Create Game
                    </MenuItem>
                    
                    <MenuItem onClick={() => {
                        setLoggedIn(false);
                        handleMenuClick('/login');
                        }}>
                        <ListItemIcon>
                            <Logout fontsize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </>
        );
    };
  
    // Searching, site toggle, New Game, and logging in/out
    // aren't connected to actions
    const HeaderBar = (props) => {

    // this should be changed to reflect the state later
    const [loggedIn, setLoggedIn] = useState(true);

    return (
    <AppBar position="static">
        <Toolbar>
            <Box display='flex' flexGrow={1} sx = {{

            }}>
                <HomeButton />
                <SearchBar/>
            </Box>

            <Box display='flex' sx={{
                justifyContent: 'flex-end',
                padding: 1.5,
                height: '100%',
            }}>
                <SiteToggle />
                {loggedIn ? <AccountDropdown loggedIn={loggedIn} setLoggedIn={setLoggedIn}/> : <LoginButton/>}
            </Box>
        </Toolbar>
    </AppBar>

    );
    }

export default HeaderBar;