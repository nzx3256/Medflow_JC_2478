// src/theme.js
import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const lightPalette = {
    mode: 'light', // Can be 'light' or 'dark'
    primary: {
        main: red[300], // Custom primary color
        light: red[200],
        dark: red[500],
        contrastText: '#fff',
    },
    secondary: {
        main: '#3f51b5',
        light: '#5c6bc0',
        dark: '#303f9f',
        contrastText: '#fff',
    },
    text: {
        primary: '#111',
        background: '#fff'
    },
    background: {
        default: '#f5f5f5', // Main app background
        paper: '#ffffff',   // Card / Paper component background
    }
};

const darkPalette = {
    mode: 'dark', // Can be 'light' or 'dark'
    primary: {
        main: '#b5005a',
        light: '#fd007e',
        dark: '#6c0036',
        contrastText: '#fff',
    },
    secondary: {
        main: '#3f51b5',
        light: '#5c6bc0',
        dark: '#303f9f',
        contrastText: '#fff',
    },
    text: {
        primary: '#f1f1f1',
        background: '#000'
    },
    background: {
        default: '#1B1B1B', // Main app background
        paper: '#384959',   // Card / Paper component background
    },
};

let baseTheme = {
    // 1. Customizing the Color Palette
    palette: lightPalette,

    // 2. Customizing Typography
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
        },
        button: {
            textTransform: 'none', // Disables the default ALL CAPS styling for buttons
        },
    },

    // 4. Global Component Component Overrides
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true, // Buttons won't have a shadow by default
            },
            styleOverrides: {
                root: {
                    borderRadius: 8, // Gives all buttons rounded corners
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Custom elegant shadow
                },
            },
        },
    },
}

const theme = (mode) => {
    switch (mode) {
        case 'light':
            baseTheme['palette'] = lightPalette;
            break;
        case 'dark':
            baseTheme['palette'] = darkPalette;
            break;
        default:
    }
    return createTheme(baseTheme);
}

export default theme;
