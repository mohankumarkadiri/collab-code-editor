import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/joy';
import { connectSocket, initializeSocket, resetSocketState } from '../store/socketSlice';
import { setUsers, setCode, updateCursor, setHost, addUser, removeUser, clearRoom, } from '../store/roomSlice';
import { useSnackbar } from '../hooks/SnackBarProvider';
import EditorControls from '../components/EditorControls';
import CodeEditor from '../components/Editor';
import CONSTANTS from '../../../shared/constants';
import ALLOWED_LANGUAGES from '../utils/languages.json';
import axiosClient from '../utils/axiosClient';

const { JOIN_ROOM, USER_LEFT, NEW_USER_JOINED, CODE_CHANGED, CURSOR_UPDATED, LANGUAGE_CHANGED } = CONSTANTS;

export default function EditorPage() {
    const [language, setLanguage] = useState('javascript');
    const [theme, setTheme] = useState('vs-dark');
    const [fontSize, setFontSize] = useState(14);
    const [tabSize, setTabSize] = useState(2);
    const [wordWrap, setWordWrap] = useState('on');
    const [lineNumbers, setLineNumbers] = useState('on');
    const [minimap, setMinimap] = useState(false);

    const { roomId } = useParams();
    const dispatch = useDispatch();
    const openSnackbar = useSnackbar();
    const { socket, connected } = useSelector((s) => s.socket) || {};
    const { _id: userId, email } = useSelector((s) => s.auth.userInfo) || {};
    const { code, users, host } = useSelector((s) => s.room) || {};

    console.log(email, host);

    useEffect(() => {
        dispatch(initializeSocket());
        dispatch(connectSocket());
    }, [dispatch]);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await axiosClient.get(`/room/${roomId}`);
                const { host, users, code: initialCode, language: roomLanguage } = response.data;

                if (host) dispatch(setHost(host));
                if (users) dispatch(setUsers(users));
                if (initialCode) dispatch(setCode(initialCode));

                const isValid = ALLOWED_LANGUAGES.some(l => l.value === roomLanguage);
                if (isValid) {
                    setLanguage(roomLanguage);
                }
            } catch (err) {
                const msg = err.response?.data?.message || err.message || 'Failed to fetch room details';
                openSnackbar(msg, 'danger');
            }
        };
        fetchRoom();
    }, [roomId, dispatch, openSnackbar]);


    useEffect(() => {
        if (!socket || !connected) return;
        socket.emit(JOIN_ROOM, { roomId });
        socket.on(NEW_USER_JOINED, handleUserJoin);
        socket.on(USER_LEFT, handleUserLeft);
        socket.on(CODE_CHANGED, handleCodeChange);
        socket.on(CURSOR_UPDATED, handleCursorUpdate);
        socket.on(LANGUAGE_CHANGED, handleLanguageChange);
        return () => {
            socket.off(NEW_USER_JOINED, handleUserJoin);
            socket.off(USER_LEFT, handleUserLeft);
            socket.off(CODE_CHANGED, handleCodeChange);
            socket.off(CURSOR_UPDATED, handleCursorUpdate);
            socket.off(LANGUAGE_CHANGED, handleLanguageChange);
            if (socket) {
                socket.disconnect();
                dispatch(clearRoom());
                dispatch(resetSocketState());
            }
        };
    }, [socket, connected, roomId, userId]);

    const handleLanguageChange = ({ language: newLanguage }) => {
        const { label, symbol } = ALLOWED_LANGUAGES.find(lang => lang.value === newLanguage);
        if (label) {
            setLanguage(newLanguage);
            openSnackbar(`Host changed language to ${label} ${symbol}`, 'success');
        }
    }

    const handleUserJoin = (newUser) => {
        dispatch(addUser(newUser));
        openSnackbar(`${newUser?.name || 'Someone'} joined the room`);
    };

    const handleUserLeft = ({ _id, name }) => {
        dispatch(removeUser(_id));
        openSnackbar(`${name} left the room`, 'warning');
    };

    const handleCodeChange = ({ code }) => {
        dispatch(setCode(code));
    };

    const handleCursorUpdate = ({ userId: remoteId, position }) => {
        dispatch(updateCursor({ userId: remoteId, position }));
    };

    const onLanguageChange = (newLanguage) => {
        if (socket && connected) {
            socket.emit(LANGUAGE_CHANGED, { language: newLanguage });
        }
    }

    const onEditorChange = (value) => {
        dispatch(setCode(value));
        if (socket && connected) {
            socket.emit(CODE_CHANGED, { code: value });
        }
    };

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, display: 'flex' }}>
                <EditorControls
                    language={language}
                    setLanguage={setLanguage}
                    canChangeLanguage={email && email == host}
                    onLanguageChange={onLanguageChange}
                    theme={theme}
                    setTheme={setTheme}
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                    tabSize={tabSize}
                    setTabSize={setTabSize}
                    wordWrap={wordWrap}
                    setWordWrap={setWordWrap}
                    lineNumbers={lineNumbers}
                    setLineNumbers={setLineNumbers}
                    minimap={minimap}
                    setMinimap={setMinimap}
                />
                <CodeEditor
                    value={code}
                    onChange={onEditorChange}
                    language={language}
                    theme={theme}
                    fontSize={fontSize}
                    tabSize={tabSize}
                    wordWrap={wordWrap}
                    lineNumbers={lineNumbers}
                    minimap={minimap}
                    users={users}
                    userId={userId}
                    onCursorUpdate={(position) => {
                        if (socket && connected) {
                            socket.emit(CURSOR_UPDATED, { userId, position });
                        }
                    }}
                />
            </Box>
        </Box>
    );
}