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
import { GlobalGameContextProvider } from './game';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import AlertModal from './components/AlertModal';

// original color palette from the minds of DERIT
const light_green = '#a1e887'
const original_green = '#80b192'
const blue_grey = '#4b4e6d'
const white = '#ffffff'
const original_primary = '#6A8D92'
const original_secondary = '#9FB4C7'
const blue_white = '#EEEFFF'
const original_theme = createTheme({
    palette: {
        primary: {
          main: original_primary,
        },
        secondary: {
          main: original_secondary,
        },
        background: {
          default: blue_white, // changes the background of every page
        },
    },
    lobby: {
        button: blue_grey,
        bg: original_primary // bg for the entire page, matches header bar tho
    },
    // GameResults, GameComment
    results: {
        text: blue_grey, // color of the underlined comments header
        comment: {
            bg: white, // color of the comment box 
            text: blue_grey 
        },
        button: {
            fill: blue_grey,
            text: white
        }
    },
    // logginScreen and RegisterScreen
    login: {
        button: {
            bg: blue_grey,
            text: white
        },
        lockIcon: {
            bg: original_secondary,
            color: white
        }
    },
    // SearchResults
    search: {
        bg: original_primary, // only changes background when searching for users for some reason
    },
    // user, game, and lobby cards
    card: {
        // other players in lobby/searching profiles
        user: {
            bg: blue_grey,
            border: original_green,
            text: light_green,
            opponentText: blue_white // text color of opponents in lobby
        },
        // live/published game cards
        game: {
            bg: original_green,
            tags: light_green,
            button: light_green
        },
        // displaying game rules in lobby
        lobby: {
            bg: blue_grey,
            text: light_green,
            border: original_green,
        },
    }
});

// everything is yellow
// used to show what is/isn't linked
// despite the constant's name, you can change the color to whatever you like
const yellow = '#ffff00'
const yellow_theme = createTheme({
    palette: {
        primary: {
          main: yellow,
        },
        secondary: {
          main: yellow,
        },
        background: {
          default: yellow,
        },
    },
    lobby: {
        button: yellow,
        bg: yellow // bg for the entire page, matches header bar tho
    },
    // GameResults, GameComment
    results: {
        text: yellow, // color of the underlined comments header
        comment: {
            bg: yellow, // color of the comment box 
            text: yellow 
        },
        button: {
            fill: yellow,
            text: yellow
        }
    },
    // logginScreen and RegisterScreen
    login: {
        button: {
            bg: yellow,
            text: yellow
        },
        lockIcon: {
            bg: yellow,
            color: yellow
        }
    },
    // SearchResults
    search: {
        bg: yellow, // only changes background when searching for users for some reason
    },
    // user, game, and lobby cards
    card: {
        // other players in lobby/searching profiles
        user: {
            bg: yellow,
            border: yellow,
            text: yellow,
            opponentText: yellow // text color of opponents in lobby
        },
        // live/published game cards
        game: {
            bg: yellow,
            tags: yellow,
            button: yellow
        },
        // displaying game rules in lobby
        lobby: {
            bg: yellow,
            text: yellow,
            border: yellow,
        },
    }
});

// Thanks lov for the color pallete
// a theme will be created to see if this works
const pink = '#dd6e80'
const green = '#8ab48e'
const purple = '#9667aa'
const blue = '#a4c6e5'
const black = '#000000'

/*
    Current Themes:
    original_theme - original colors from the collective mind of DERIT
    yellow_theme - everything is yellow; used to show what is connected to the theme
*/
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
                        <GlobalGameContextProvider>
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
                            <AlertModal></AlertModal>
                        </GlobalGameContextProvider>
                        </SocketContext.Provider>
                    </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
        </ThemeProvider>

    );
}

export default App