import {
    FormControl,
    FormLabel,
    Select,
    Option,
    Sheet,
    Box,
    Button,
} from '@mui/joy';

import LANGUAGES from '../utils/languages.json';

const THEMES = ['vs-dark', 'light', 'hc-black'];
const FONT_SIZES = [12, 14, 16, 18, 20];
const TAB_SIZES = [2, 4, 8];

export default function EditorControls({
    language,
    setLanguage,
    canChangeLanguage,
    onLanguageChange,
    theme,
    setTheme,
    fontSize,
    setFontSize,
    tabSize,
    setTabSize,
    wordWrap,
    setWordWrap,
    lineNumbers,
    setLineNumbers,
    minimap,
    setMinimap,
}) {
    const resetDefaults = () => {
        setLanguage('javascript');
        setTheme('vs-dark');
        setFontSize(14);
        setTabSize(2);
        setWordWrap('on');
        setLineNumbers('on');
        setMinimap(false);
    };

    return (
        <Sheet
            sx={{
                width: 240,
                p: 2,
                bgcolor: 'background.level1',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRadius: 0,
            }}
        >
            <Box>
                <FormControl>
                    <FormLabel>Language</FormLabel>
                    <Select size="sm" value={language} onChange={(_, v) => {
                        setLanguage(v);
                        onLanguageChange(v);
                    }} disabled={!canChangeLanguage}>
                        {LANGUAGES.map((l) => (
                            <Option key={l.value} value={l.value}>
                                {l.label}
                            </Option>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box>
                <FormControl>
                    <FormLabel>Theme</FormLabel>
                    <Select size="sm" value={theme} onChange={(_, v) => setTheme(v)}>
                        {THEMES.map((t) => (
                            <Option key={t} value={t}>
                                {t}
                            </Option>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box>
                <FormControl>
                    <FormLabel>Font Size</FormLabel>
                    <Select size="sm" value={fontSize} onChange={(_, v) => setFontSize(+v)}>
                        {FONT_SIZES.map((s) => (
                            <Option key={s} value={s}>
                                {s}px
                            </Option>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box>
                <FormControl>
                    <FormLabel>Tab Size</FormLabel>
                    <Select size="sm" value={tabSize} onChange={(_, v) => setTabSize(+v)}>
                        {TAB_SIZES.map((s) => (
                            <Option key={s} value={s}>
                                {s} spaces
                            </Option>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box>
                <FormControl>
                    <FormLabel>Word Wrap</FormLabel>
                    <Select size="sm" value={wordWrap} onChange={(_, v) => setWordWrap(v)}>
                        <Option value="on">On</Option>
                        <Option value="off">Off</Option>
                    </Select>
                </FormControl>
            </Box>

            <Box>
                <FormControl>
                    <FormLabel>Line Numbers</FormLabel>
                    <Select size="sm" value={lineNumbers} onChange={(_, v) => setLineNumbers(v)}>
                        <Option value="on">Show</Option>
                        <Option value="off">Hide</Option>
                    </Select>
                </FormControl>
            </Box>

            <Box>
                <FormControl>
                    <FormLabel>Minimap</FormLabel>
                    <Select
                        size="sm"
                        value={minimap ? 'true' : 'false'}
                        onChange={(_, v) => setMinimap(v === 'true')}
                    >
                        <Option value="true">Enabled</Option>
                        <Option value="false">Disabled</Option>
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ mt: 2 }}>
                <Button size="sm" variant="outlined" onClick={resetDefaults} fullWidth>
                    Reset to Defaults
                </Button>
            </Box>
        </Sheet>
    );
}