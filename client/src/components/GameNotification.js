import { React} from 'react'
import { Store }  from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';
import { SocketContext } from "../context/socket";
import { useContext } from 'react';
import { useEffect } from 'react';


// Displays a notification for a new created game

const GameNotification = (props) => {

    const socket = useContext(SocketContext);
    useEffect(()=>{
        socket.on('newGameNotification', function(data) {
            const {email, gameID} = data;
            const notification = {
                title: email + " has started a new game!",
                message: 'Click to copy the game code: ' + gameID,
                type: 'success',                         // 'default', 'success', 'info', 'warning'
                container: 'top-right',                // where to position the notifications
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 10000 // lasts for 10 seconds
                },
                onRemoval: (id, removedBy) => {
                    if(removedBy == "click")
                        navigator.clipboard.writeText(gameID)
                }
            }
            Store.addNotification(notification); // displays notification
            Store.removeNotification(notification);
        })
    }, [])

    // we just want the socket receiver to exist on every page
    return (
        <></>
    )
}

export default GameNotification