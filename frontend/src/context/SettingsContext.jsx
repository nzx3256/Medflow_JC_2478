import { useState, createContext, useContext } from "react";

const SettingsContext = createContext(null);

const baseSettings = {
    themeMode: undefined
};
const getSettings = () => {
    const s = localStorage.getItem('settings') ?? baseSettings;
    try {
        return JSON.parse(s);
    }
    catch { // in case s is undefined or not valid json
        localStorage.setItem('settings', JSON.stringify(baseSettings));
        return baseSettings;
    }
};

export function SettingsProvider({ children }) {
    //const [settings, setSettings] = useState(getSettings());
    const [themeMode, setThemeMode] = useState(getSettings()?.themeMode);

    const changeThemeMode = (mode = null) => {
        let newMode = undefined;
        switch (mode) {
            case 'light':
            case 'dark':
                newMode = mode;
                break;
            default:
                // TODO: default means baseSettings is set. So set 
                newMode = (window.matchMedia("(prefers-color-scheme: light)").matches ? 'light' : 'dark');
                break;
        }
        const settings = getSettings();
        settings.themeMode = newMode;
        setThemeMode(newMode);
        localStorage.setItem('settings', JSON.stringify(settings));
        return settings;
    };

    const values = { themeMode, getSettings, changeThemeMode };
    return (
        <SettingsContext.Provider value={values}> {children} </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings() must be a child of the SettingsProvider tag.");
    }
    return context;
}
