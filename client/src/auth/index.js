import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                console.log("Inside GET_LOGGED_IN reducer, loggedIn: ", payload.loggedIn);
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn
                });
            }
            case AuthActionType.REGISTER_USER: {
                console.log("Inside REGISTER_USER reducer, loggedIn: ", true);
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                })
            }
            case AuthActionType.LOGIN_USER: {
                console.log("Inside LOGIN_USER reducer, loggedIn: ", payload.loggedIn);
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn //Assuming that if the login user reducer is called, we're loggedIn
                })
            }
            case AuthActionType.LOGOUT_USER: {
                console.log("Inside logout_USER reducer, loggedIn: ", payload.loggedIn);
                return setAuth({
                    user: null,
                    loggedIn: false //Assuming that if the login user reducer is called, we're loggedIn
                })
            }
            default:
                return auth;
        }
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };