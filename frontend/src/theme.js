// src/theme.js
import { createTheme } from '@mui/material/styles';

const lightPalette = {
    mode: 'light', // Can be 'light' or 'dark'
    primary: {
        main: '#e57373', // Custom primary color
        light: '#ef9a9a',
        dark: '#f44336',
        contrastText: '#fff',
    },
    secondary: {
        main: '#3f51b5',
        light: '#5c6bc0',
        dark: '#303f9f',
        contrastText: '#fff',
    },
    background: {
        default: '#f5f5f5', // Main app background
        paper: '#ffffff',   // Card / Paper component background
    }
};

const darkPalette = {
    mode: 'dark', // Can be 'light' or 'dark'
    primary: {
        main: '#e57373', // Custom primary color
        light: '#ef9a9a',
        dark: '#f44336',
        contrastText: '#afafaf',
    },
    secondary: {
        main: '#3f51b5',
        light: '#5c6bc0',
        dark: '#303f9f',
        contrastText: '#afafaf',
    },
    background: {
        default: '#2B2B2B', // Main app background
        paper: '#384959',   // Card / Paper component background
    },
};

const baseTheme = {
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

    // 3. Customizing Global Breakpoints
    // breakpoints: {
    //     values: {
    //         xs: 0,
    //         sm: 600,
    //         md: 900,
    //         lg: 1200,
    //         xl: 1536,
    //     },
    // },

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
    return baseTheme;
}

export default theme;
