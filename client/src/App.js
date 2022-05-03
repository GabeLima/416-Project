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
    RegisterScreen,
    GameNotification
  
} from "./components";
import GameResult from './components/GameResult';
import { SocketContext, socket} from "./context/socket";
import { GlobalStoreContextProvider } from './store';
import { GlobalGameContextProvider } from './game';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import AlertModal from './components/AlertModal';
import DeleteModal from './components/DeleteModal';
// notify followers
import {ReactNotifications} from 'react-notifications-component';

// theme imports
import original_theme from './themes/original';
import test_theme from './themes/testing';
import updated_theme from './themes/updated';
let themes = new Map( [
    ['original', original_theme],
    ['test', test_theme],
    ['updated', updated_theme]
]);

/*
    Current Themes (themes['name']):
    original - original colors from the collective mind of DERIT
    test - everything  is set to one color to determine what's connected
    updated - work in progress for improved color palette
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
                            <ReactNotifications />
                            <GameNotification />
                            
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
                            <DeleteModal></DeleteModal>
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