import { createContext, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import api from '../api'
import AuthContext from '../auth'

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    SET_ERROR_MESSAGE: "SET_ERROR_MESSAGE",
    SET_SEARCH_QUERY: "SET_SEARCH_QUERY",
    CHANGE_MODE: "CHANGE_MODE"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        errorMessage:null,
        searchQuery: "",
        isComic: true
    });

    const history = useHistory();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.SET_ERROR_MESSAGE: {
                return setStore({
                    errorMessage: payload
                });
            }
            case GlobalStoreActionType.SET_SEARCH_QUERY: {
                return setStore({
                    ... store,
                    searchQuery: payload
                });
            }
            case GlobalStoreActionType.CHANGE_MODE: {
                return setStore({
                    ... store,
                    isComic: !store.isComic
                });
            }
            default:
                return store;
        }
    }

    //SET THE ERROR MESSAGE SO WE CAN DISPLAY IT IN THE ALERT MODAL
    store.setErrorMessage = function (errorMsg) {
        storeReducer({
            type: GlobalStoreActionType.SET_ERROR_MESSAGE,
            payload: errorMsg
        });
    }
    
    store.handleSearch = function (query) {
        if (query === "") {
            storeReducer({
                type: GlobalStoreActionType.SET_SEARCH_QUERY,
                payload: ""
            });
            return;
        }
        console.log("Updating search query " + query);
        storeReducer({
            type: GlobalStoreActionType.SET_SEARCH_QUERY,
            payload: `${query}` // HACK Use template literal to copy the string!!!
        });

        history.push("/search/");
    }

    store.handleChangeMode = function () {
        console.log("Switching to " + (store.isComic ? "story" : "comic"));
        storeReducer({
            type: GlobalStoreActionType.CHANGE_MODE
        });

       // history.push("/"); // TODO - Is this a good idea??
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );

}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };