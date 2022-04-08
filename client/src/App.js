import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import {
    Paint,
    CreateGame,
    GameLobby,
    SearchResults,
    SearchResultsUser,
    AccountScreen,
    HomeScreen,
    ComicGameInProgressScreen,
    StoryGameInProgressScreen,
    LoginScreen,
    RegisterScreen
  
} from "./components"
import { SocketContext, socket} from "./context/socket";
import { GlobalStoreContextProvider } from './store';


const App = () => {
    console.log(socket);
    console.log(SocketContext);
    return (
        
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>
                    <SocketContext.Provider value={socket}>
                        <Switch>
                            <Route path="/" exact component={HomeScreen} />
                            <Route path="/account" exact component={AccountScreen} />
                            <Route path="/CGameInProgress/:id" exact component={ComicGameInProgressScreen} />
                            <Route path="/SGameInProgress/:id" exact component={StoryGameInProgressScreen} />
                            <Route path="/paint" exact component={Paint} />
                            <Route path="/login/" exact component={LoginScreen} />
                            <Route path="/register/" exact component={RegisterScreen} />
                            <Route path="/lobby" exact component={GameLobby} />
                            <Route path="/create" exact component={CreateGame} />
                            <Route path="/search" exact component={SearchResults} />
                            <Route path="/search_user" exact component={SearchResultsUser} />
                        </Switch>
                        </SocketContext.Provider>
                    </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    );
}

export default App