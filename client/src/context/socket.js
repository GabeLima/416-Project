import socketio from "socket.io-client";
import { createContext } from 'react'
import { SOCKET_ENDPOINT } from "../config";

export const socket = socketio.connect(SOCKET_ENDPOINT);
export const SocketContext = createContext();
