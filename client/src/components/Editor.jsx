import { useEffect, useRef, useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Box } from '@mui/joy';

const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#1DD1A1', '#F368E0'
];

export default function CodeEditor({
    value,
    onChange,
    language,
    theme,
    fontSize,
    tabSize,
    wordWrap,
    lineNumbers,
    minimap,
    users,
    userId,
    onCursorUpdate
}) {
    const [editorReady, setEditorReady] = useState(false);
    const editorRef = useRef(null);
    const decorationIdsRef = useRef({});
    const userColorMap = useRef({});
    const cursorDisposableRef = useRef(null);
    const cursorTimeoutsRef = useRef({});
    const isLocalChange = useRef(false);

    const onEditorMount = (editor) => {
        editorRef.current = editor;
        setEditorReady(true);
    };

    const handleEditorChange = (value) => {
        isLocalChange.current = true;
        onChange(value);
        setTimeout(() => { isLocalChange.current = false; }, 100);
    };

    const handleCursorPositionChange = useCallback((event) => {
        if (!onCursorUpdate || isLocalChange.current || !userId) return;
        let position;
        if (event.position) {
            position = { lineNumber: event.position.lineNumber, column: event.position.column };
        } else if (event.selection) {
            const startPosition = event.selection.getStartPosition();
            position = { lineNumber: startPosition.lineNumber, column: startPosition.column };
        } else return;
        onCursorUpdate(position);
    }, [onCursorUpdate, userId]);

    useEffect(() => {
        if (!editorReady || !editorRef.current) return;
        const editor = editorRef.current;
        if (cursorDisposableRef.current) cursorDisposableRef.current.dispose();
        cursorDisposableRef.current = editor.onDidChangeCursorPosition(handleCursorPositionChange);
        return () => {
            if (cursorDisposableRef.active) cursorDisposableRef.current.dispose();
        };
    }, [editorReady, handleCursorPositionChange]);

    const updateCursorStyles = (userId, color, userName) => {
        let styleEl = document.getElementById('cursor-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'cursor-styles';
            document.head.appendChild(styleEl);
        }
        const cursorStyle = `
      .monaco-editor .remote-cursor-${userId} {
        border-left: 2px solid ${color} !important;
        position: relative;
        z-index: 10;
      }
      .monaco-editor .remote-cursor-${userId}::after {
        content: '${userName}';
        position: absolute;
        top: -20px;
        left: 0;
        color: ${color};
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
        z-index: 100;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      .monaco-editor .remote-cursor-${userId}.cursor-active::after {
        opacity: 1;
      }
      .monaco-editor .remote-cursor-${userId}:hover::after {
        opacity: 1;
      }
    `;
        if (!styleEl.innerHTML.includes(`remote-cursor-${userId}`)) {
            styleEl.innerHTML += cursorStyle;
        }
    };

    useEffect(() => {
        if (!editorReady || !editorRef.current || !users) return;
        const editor = editorRef.current;
        users.forEach(user => {
            if (user._id === userId) return;
            const remoteId = user._id;
            const userName = user.name || 'User';
            const position = user.position;
            const color = userColorMap.current[remoteId] || (userColorMap.current[remoteId] = COLORS[Object.keys(userColorMap.current).length % COLORS.length]);
            updateCursorStyles(remoteId, color, userName);
            if (!position || !position.lineNumber || !position.column) {
                if (decorationIdsRef.current[remoteId]) {
                    editor.deltaDecorations(decorationIdsRef.current[remoteId], []);
                    delete decorationIdsRef.current[remoteId];
                }
                return;
            }
            const range = new window.monaco.Range(
                position.lineNumber, position.column,
                position.lineNumber, position.column
            );
            const decorations = [{
                range,
                options: {
                    className: `remote-cursor-${remoteId} cursor-active`,
                    hoverMessage: { value: `${userName}'s cursor` },
                    stickiness: window.monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
                }
            }];
            const oldDecorations = decorationIdsRef.current[remoteId] || [];
            decorationIdsRef.current[remoteId] = editor.deltaDecorations(oldDecorations, decorations);
            if (cursorTimeoutsRef.current[remoteId]) clearTimeout(cursorTimeoutsRef.current[remoteId]);
            cursorTimeoutsRef.current[remoteId] = setTimeout(() => {
                if (decorationIdsRef.current[remoteId]) {
                    const updatedDecorations = [{
                        range,
                        options: {
                            className: `remote-cursor-${remoteId}`,
                            hoverMessage: { value: `${userName}'s cursor` },
                            stickiness: window.monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
                        }
                    }];
                    decorationIdsRef.current[remoteId] = editor.deltaDecorations(decorationIdsRef.current[remoteId], updatedDecorations);
                }
                delete cursorTimeoutsRef.current[remoteId];
            }, 3000);
        });
    }, [editorReady, users, userId, value]);

    useEffect(() => {
        return () => {
            if (cursorDisposableRef.current) cursorDisposableRef.current.dispose();
            Object.values(cursorTimeoutsRef.current).forEach(clearTimeout);
            const styleEl = document.getElementById('cursor-styles');
            if (styleEl) styleEl.remove();
        };
    }, []);

    return (
        <Box sx={{ flex: 1 }}>
            <Editor
                height="100%"
                language={language}
                theme={theme}
                value={value}
                onChange={handleEditorChange}
                onMount={onEditorMount}
                options={{
                    fontSize,
                    tabSize,
                    wordWrap,
                    lineNumbers,
                    minimap: { enabled: minimap },
                    automaticLayout: true,
                    padding: { top: 30 },
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: 'line'
                }}
            />
        </Box>
    );
}