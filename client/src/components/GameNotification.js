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

    // displays react notification when newGameNotification is received
    useEffect(()=>{
        socket.on('newGameNotification', function(data) {
            const {email, gameID} = data;
            const notification = {
                title: "NEW GAME BITCH FUCK YOU NEW GAME HOLY SHIT FUCK YOU",//email + " has started a new game!",
                message: 'Game ID: ' + gameID,
                type: 'default',                         // 'default', 'success', 'info', 'warning'
                container: 'top-right',                // where to position the notifications
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 10000 
                }
            }
            Store.addNotification(notification);
            Store.removeNotification(notification);
        })
    }, [])

    // we just want the socket receiver to display on every page
    return (
        <></>
    )
}

export default GameNotification