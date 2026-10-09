import {
    Button, Dialog, DialogContent, DialogTitle, Paper, Tooltip, Typography
} from "@mui/material";
import { useSettings } from "../../context/SettingsContext";
import { useMemo } from "react";
import { DarkMode, LightMode } from "@mui/icons-material";

function SettingsPage({ open, onClose }) {
    const { themeMode, changeThemeMode } = useSettings();

    let inverseMode = useMemo(() => {
        return themeMode === 'light' ? 'dark' : 'light'
    }, [themeMode]);
    const toggleThemeMode = () => {
        changeThemeMode(inverseMode);
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <Paper sx={{ backgroundColor: 'secondary', p: 1, m: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant='h5' children={"Settings"} color='text.primary' />
            </Paper>
            <DialogContent>
                <Typography component='span' variant='subtitle1' color="primary.contrastText" children={"Theme Mode Toggle: "} />
                <Tooltip title={`Click to switch to ` +
                    `${inverseMode[0].toUpperCase()}` +
                    `${inverseMode.slice(1)} Mode`}
                >
                    <Button variant="contained"
                        sx={{
                            m: 1,
                            backgroundColor: themeMode === 'light' ? 'primary' : 'secondary',
                            color: 'white'
                        }}
                        onClick={() => toggleThemeMode()}
                    >
                        {themeMode === 'light' && <LightMode />}
                        {themeMode === 'dark' && <DarkMode />}
                        {`${themeMode[0].toUpperCase()}${themeMode.slice(1)} Mode`}
                    </Button>
                </Tooltip>
            </DialogContent>
        </Dialog >
    );
}

export default SettingsPage;
