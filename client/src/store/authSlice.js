import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: false,
    userInfo: {},
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        login: (state, action) => {
            state.loggedIn = true;
            state.userInfo = action.payload;
        },
        logout: (state) => {
            state.loggedIn = false;
            state.userInfo = {};
        }
    }
})


export default authSlice.reducer;
export const { login, logout } = authSlice.actions;