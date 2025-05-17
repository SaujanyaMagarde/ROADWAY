import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";
import { useDispatch } from "react-redux";

// Initialize socket with options
const socket = io(`${import.meta.env.VITE_SERVER_URL}`, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: false
});

const initialState = {
    connected: false,
    messages: [],
    error: null,
};

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setConnected: (state, action) => {
            state.connected = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    }
});

export const { setConnected, addMessage, setError} = socketSlice.actions;

// Socket middleware functions
export const initializeSocket = () => (dispatch) => {
    // Connect the socket
    socket.connect();

    socket.on("connect", () => {
        console.log("✅ Socket Connected Successfully!", socket.id);
        dispatch(setConnected(true));
    });

    socket.on("connect_error", (error) => {
        console.error("🔴 Connection Error:", error);
        dispatch(setError(error.message));
    });

    socket.on("disconnect", () => {
        console.log("❌ Socket Disconnected!");
        dispatch(setConnected(false));
    });

    socket.on("error", (error) => {
        console.error("🔴 Socket Error:", error);
        dispatch(setError(error));
    });
};

export const sendMessage = (message) => () => {
    console.log("Sending message:", message);
    socket.emit("message", message);
};

export const listenForMessages = () => (dispatch) => {
    socket.on("message", (message) => {
        console.log(" Received message:", message);
        dispatch(addMessage(message));
    });
};

export { socket };

export default socketSlice.reducer;
