import { React, useContext, useEffect, useCallback } from 'react'
import { SocketContext } from "../context/socket";
import Painterro from "painterro"

const Paint = (props) => {
    console.log(SocketContext);
    const socket = useContext(SocketContext);
    
    
    let saveHandler = (image, done) => {
        socket.emit("sendPicture", image.asBlob());
    }

    const p = Painterro({
        defaultTool: "brush",
        hiddenTools: ["crop", "resize", "save", "open", "zoomin", "zoomout", "select", "settings", "pixelize", "close"],
        saveHandler: saveHandler
    }).show();

    const handleGetPicture = useCallback(() => {
        console.log("Server wants picture");
        p.save();
    }, [p]);

    useEffect(() => {
        socket.on("getPicture", handleGetPicture);
        return () => {socket.off("getPicture");}
    }, [socket, handleGetPicture]);

    
    
    

    return <div>
    </div>
}

export default Paint