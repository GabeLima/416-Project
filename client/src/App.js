import './App.css';
import { React, useState, useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import {
    AccountScreen,
    HomeScreen,
    Paint,
    ComicGameInProgressScreen,
    StoryGameInProgressScreen,
    HeaderBar,
    Profile
} from "./components"
import { SocketContext, socket} from "./context/socket";


const App = () => {
    console.log(socket);
    console.log(SocketContext);
    return (
        <BrowserRouter>
            <SocketContext.Provider value={socket}>
                <HeaderBar />
                <Switch>
                    <Route path="/" exact component={HomeScreen} />
                    <Route path="/account" exact component={AccountScreen} />
                    <Route path="/profile" exact component={Profile} />
                    <Route path="/CGameInProgress/:id" exact component={ComicGameInProgressScreen} />
                    <Route path="/SGameInProgress/:id" exact component={StoryGameInProgressScreen} />
                    <Route path="/paint" exact component={Paint} />
                </Switch>
                </SocketContext.Provider>
        </BrowserRouter>
    );
}

export default App