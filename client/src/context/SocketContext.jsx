import { createContext, useEffect, useRef, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import AuthContext from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const socket = useRef();
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if (user) {
            socket.current = io(import.meta.env.VITE_API_URL);

            socket.current.emit("join_room", "global"); // Simple implementation

            socket.current.on("receive_sos", (data) => {
                // Can Handle global notifications here
                console.log("SOS RECEIVED:", data);
            });

        } else {
            if (socket.current) {
                socket.current.disconnect();
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket: socket.current }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
