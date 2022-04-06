import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
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
            DERIT
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
            setAlignment(newAlignment);
        };
        return (
        <ToggleButtonGroup 
            exclusive 
            onChange={handleChange}
            value={alignment}
            color="secondary"
        >
            <ToggleButton color="secondary" value="comic">Comic</ToggleButton>
            <ToggleButton color="secondary" value="story">Story</ToggleButton>
        </ToggleButtonGroup>
        );
    };

    // TODO route text to search
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
            color: 'secondary'
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

                    <MenuItem onclick={() => handleMenuClick('/create')}>
                        <ListItemIcon>
                            <AddIcon fontsize="small"/>
                        </ListItemIcon>
                        New Game
                    </MenuItem>
                    
                    <MenuItem onClick={() => handleMenuClick('/logout')}>
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
    // aren't to anything yet
    const HeaderBar = (props) => {

    // this should be changed to reflect the state later
    let loggedIn = true;

    return (
    <AppBar position="static" sx={{
        color: 'primary.main'
    }}>
        <Toolbar sx={{
            justifyContent: "space-between"
        }}>
            <Box display='flex' flexGrow={1}>
                <HomeButton />
                <SearchBar/>
            </Box>

            <SiteToggle />
            {loggedIn ? <AccountDropdown/> : <LoginButton/>}
        </Toolbar>
    </AppBar>

    );
    }

export default HeaderBar;