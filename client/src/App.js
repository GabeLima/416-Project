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
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';


const App = () => {
    console.log(socket);
    console.log(SocketContext);

    // applies the theme to all components
    // we can potentialyl add other themes later
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

    return (
        <ThemeProvider theme={default_theme}>
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
        </ThemeProvider>
    );
}

export default App