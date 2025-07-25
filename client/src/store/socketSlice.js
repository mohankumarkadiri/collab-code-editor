import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

let socket = null;

const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        socket: null,
        connected: false,
    },
    reducers: {
        setSocket(state, action) {
            state.socket = action.payload;
        },
        setConnected(state, action) {
            state.connected = action.payload;
        },
        resetSocketState(state) {
            state.socket = null;
            state.connected = false;
        }
    },
});

export const { setSocket, setConnected, resetSocketState } = socketSlice.actions;

export const initializeSocket = () => (dispatch) => {
    socket = io('http://localhost:17291', {
        withCredentials: true,
        autoConnect: false,
        reconnectionAttempts: 3,
    });

    socket.on('connect', () => dispatch(setConnected(true)));
    socket.on('disconnect', () => dispatch(setConnected(false)));

    dispatch(setSocket(socket));
};

export const connectSocket = () => () => {
    if (socket && !socket.connected) {
        socket.connect();
    }
};

export default socketSlice.reducer;