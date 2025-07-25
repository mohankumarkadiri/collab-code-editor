import { extendTheme } from '@mui/joy/styles';

const theme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                primary: { 
                    solidBg: '#2563eb',
                    solidHoverBg: '#1d4ed8',
                    plainColor: '#2563eb',
                    plainHoverBg: '#f1f5f9',
                    outlinedBorder: '#2563eb',
                    outlinedHoverBg: '#f1f5f9',
                    softBg: '#f1f5f9',
                    softHoverBg: '#e2e8f0',
                },
                neutral: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                },
                background: {
                    body: '#ffffff',
                    surface: '#ffffff',
                    level1: '#f8fafc',
                },
                text: {
                    primary: '#1f2937',
                    secondary: '#6b7280',
                },
                divider: '#e5e7eb',
            },
        },
        dark: {
            palette: {
                primary: {
                    solidBg: '#3b82f6',
                    solidHoverBg: '#2563eb',
                    plainColor: '#60a5fa',
                    plainHoverBg: '#1e293b',
                    outlinedBorder: '#3b82f6',
                    outlinedHoverBg: '#1e293b',
                    softBg: '#1e293b',
                    softHoverBg: '#334155',
                },
                background: {
                    body: '#0f172a',
                    surface: '#1e293b',
                    level1: '#334155',
                },
                text: {
                    primary: '#f1f5f9',
                    secondary: '#cbd5e1',
                },
                divider: '#475569',
            },
        },
    },
    typography: {
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    },
    components: {
        JoyButton: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    textTransform: 'none',
                    fontWeight: 500,
                },
            },
        },
        JoyInput: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                },
            },
        },
        JoySheet: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                },
            },
        },
    },
});

export default theme;