import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme.js'
import './index.css'
import App from './App.jsx'
import { SettingsProvider, useSettings } from './context/SettingsContext.jsx'

function BootStrap() {
    const { themeMode, changeThemeMode } = useSettings();
    changeThemeMode(themeMode);
    return (
        <ThemeProvider theme={theme(themeMode)}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    );
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <SettingsProvider>
            <BootStrap />
        </SettingsProvider>
    </StrictMode>,
)
