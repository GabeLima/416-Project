import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import {
    Paint,
    CreateGame,
    GameLobby,
    SearchResults,
    AccountScreen,
    HomeScreen,
    ComicGameInProgressScreen,
    StoryGameInProgressScreen,
    HeaderBar,
    Profile,
    LoginScreen,
    RegisterScreen
  
} from "./components";
import GameResult from './components/GameResult';
import { SocketContext, socket} from "./context/socket";
import { GlobalStoreContextProvider } from './store';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

const yellow = '#ffff00'

// original color palette from the minds of DERIT
const light_green = '#a1e887'
const original_green = '#80b192'
const blue_grey = '#4b4e6d'
const original_theme = createTheme({
    palette: {
        primary: {
          main: '#6A8D92',
          lobbyBorder: original_green
        },
        secondary: {
          main: '#9FB4C7',
        },
        background: {
          default: '#EEEFF',
        },
    },
    lobby: {
        border: {
            main: original_green
        },
        button: { 
            main: yellow
        },
        text: {
            main: light_green
        },
        bg: {
            main: blue_grey
        }
    },
    components: {
        Tags: {
            backgroundColor: light_green
        }
    }
});

    // Thanks lov for the color pallete
    const pink = '#dd6e80'
    const green = '#8ab48e'
    const purple = '#9667aa'
    const blue = '#a4c6e5'
    const black = '#000000'
    // the background overwrites things
    // BUT boxes and grids usually cover it
    // so those need to fill in to match
    const theme1 = createTheme({
        palette: {
            primary: {
            main: blue,
            },
            secondary: {
            main: purple,
            },
            background: {
                default: pink,
            },
            
        },

        lobbyCard: {
            border: {
                main: yellow
            },
            button: { 
                main: yellow
            },
        },
    });

const App = () => {
    console.log(socket);
    console.log(SocketContext);

    return (
        <ThemeProvider theme={original_theme}>
        <CssBaseline />

        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>
                    <SocketContext.Provider value={socket}>
                        <HeaderBar />
                        <Switch>
                            <Route path="/" exact component={HomeScreen} />
                            <Route path="/account" exact component={AccountScreen} />
                            <Route path="/profile/:username" exact component={Profile} />
                            <Route path="/CGameInProgress/:id" exact component={ComicGameInProgressScreen} />
                            <Route path="/SGameInProgress/:id" exact component={StoryGameInProgressScreen} />
                            <Route path="/paint" exact component={Paint} />
                            <Route path="/login/" exact component={LoginScreen} />
                            <Route path="/register/" exact component={RegisterScreen} />
                            <Route path="/gameResult/:id" exact component={GameResult}/>
                            <Route path="/lobby" exact component={GameLobby} />
                            <Route path="/create" exact component={CreateGame} />
                            <Route path="/search" exact component={SearchResults} />
                        </Switch>
                        </SocketContext.Provider>
                    </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
        </ThemeProvider>

    );
}

export default App