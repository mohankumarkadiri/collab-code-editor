import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    host: "",
    users: [],
    code: '// start coding',
    cursors: {},
    userColors: {},
};

const COLORS = [
    '#FF5733', '#33B5FF', '#4CAF50', '#FFC107', '#9C27B0', '#FF9800', '#00BCD4', '#E91E63'
];

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setHost: (state, action) => {
            state.host = action.payload;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
            action.payload.forEach((user, index) => {
                state.userColors[user._id] = COLORS[index % COLORS.length];
            });
        },
        addUser: (state, action) => {
            const newUser = action.payload;
            if (state.users.find(user => user._id === newUser?._id)) return;
            state.users.push(newUser);
            const index = state.users.length - 1;
            state.userColors[newUser._id] = COLORS[index % COLORS.length];
        },
        removeUser: (state, action) => {
            const userId = action.payload;
            if (!userId) return;
            state.users = state.users.filter(user => user._id !== userId);
            delete state.userColors[userId];
            delete state.cursors[userId];
        },
        setCode: (state, action) => {
            state.code = action.payload;
        },
        updateCursor: (state, action) => {
            const { userId, position } = action.payload;
            state.cursors[userId] = position;
        },
        clearRoom: () => {
            return initialState;
        },
    },
});

export const { setHost, setUsers, addUser, removeUser, setCode, updateCursor, clearRoom } = roomSlice.actions;
export default roomSlice.reducer;