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
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { GlobalStoreContextProvider } from './store';
import { CssBaseline } from '@mui/material';


const App = () => {
    console.log(socket);
    console.log(SocketContext);

    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>
                    <SocketContext.Provider value={socket}>
                        <HeaderBar />
                        <Switch>
                            <Route path="/" exact component={HomeScreen} />
                            <Route path="/account" exact component={AccountScreen} />
                            <Route path="/profile" exact component={Profile} />
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
    );
}

export default App