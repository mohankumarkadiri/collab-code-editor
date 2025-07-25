import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import socketReducer from "./socketSlice";
import roomReducer from "./roomSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        socket: socketReducer,
        room: roomReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;