import { createContext, useState } from 'react'

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    SET_ERROR_MESSAGE: "SET_ERROR_MESSAGE"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        errorMessage:null
    });
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.SET_ERROR_MESSAGE: {
                return setStore({
                    errorMessage: payload
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