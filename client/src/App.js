import { React, useState, useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import {
    Paint
} from "./components"
import { SocketContext, socket} from "./context/socket";


const App = () => {
    console.log(socket);
    console.log(SocketContext);
    return (
        
        <BrowserRouter>
            <SocketContext.Provider value={socket}>
                <Switch>
                    <Route path="/" exact component={Paint} />
                </Switch>
                </SocketContext.Provider>
        </BrowserRouter>
    );
}

export default App