import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { styled, alpha, createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/private-theming';
import { useHistory } from 'react-router-dom';
import { 
    AppBar, Box, Toolbar, IconButton, Typography, 
    InputBase, MenuItem, Menu, Tooltip, Avatar, 
    Button,ToggleButton, ToggleButtonGroup, ListItemIcon,
} from '@mui/material';


const default_theme = createTheme({
    palette: {
        primary: {
          main: '#6A8D92',
        },
        secondary: {
          main: '#9FB4C7',
        }
    },
  });

    // Button that has logo and routes to the homepage
    const HomeButton = () => {
        let history = useHistory();
        return (
        <Button color="inherit" onClick={() => history.push('/')}>
            Home Button
        </Button>
        );
    };

    const PlayButton = () => {
        let history = useHistory();
        return (
            <ThemeProvider theme={default_theme}>
                <Button variant ="contained" color="primary">Play</Button>
            </ThemeProvider>
        );
    };

    // Switch between comic/story site
    const SiteToggle = () => {
        const [alignment, setAlignment] = React.useState('web');
        const handleChange = (event, newAlignment) => {
            setAlignment(newAlignment);
        };
        return (
        <ToggleButtonGroup exclusive onChange={handleChange}>
            <ToggleButton value="comic">Comic</ToggleButton>
            <ToggleButton value="story">Story</ToggleButton>
        </ToggleButtonGroup>
        );
    };

    const SearchBar = () => {
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
        }));

        const StyledInputBase = styled(InputBase)(({ theme }) => ({
            color: 'inherit', '& .MuiInputBase-input': {
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
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search DERIT"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
        );
    };

    // Contains menu dropdown and routes for
    // View Profile, Account Settings, Logout
    // TODO handle the logout route 
    const AccountDropdown = (props) => {
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
            history.push(pageURL);
        };

        return (
            <Box sx={{ flexGrow: 1 }} flexDirection="column">
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
                    
                    <MenuItem onClick={() => handleMenuClick('/logout')}>
                        <ListItemIcon>
                            <Logout fontsize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>

            </Box>
        );
    };
  
  const HeaderBar = (props) => {

    return (
    <ThemeProvider theme={default_theme}>
        <Box>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <HomeButton />
                    <SearchBar/>
                    <SiteToggle />
                    <PlayButton />
                    <AccountDropdown style={{justifyContent: "flex-end"}}/>
                </Toolbar>
            </AppBar>
        </Box>
    </ThemeProvider>
    );
  }

export default HeaderBar;