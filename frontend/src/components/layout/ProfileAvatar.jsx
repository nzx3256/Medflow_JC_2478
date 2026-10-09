import { useState, useMemo } from "react";
import {
    Avatar, IconButton, ListItemIcon, Menu, MenuItem
} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

import { useAuth } from "../../context/AuthContext";
import SettingsPage from "../pages/SettingsPage";

const stringToColor = (str) => {
    let hash = 0;
    str.split('').forEach(char => {
        hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })
    let color = '#'
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff
        color += value.toString(16).padStart(2, '0')
    }
    return color
};

function ProfileAvatar() {
    const { user, logout } = useAuth();
    const name = user?.sub ?? "NA";
    const [anchorEl, setAnchorEl] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    let open = useMemo(() => { return anchorEl != undefined; }, [anchorEl]);
    const handleClose = () => setAnchorEl(null);
    const settingsClose = () => setSettingsOpen(false);
    return (
        <>
            <IconButton
                onClick={(event) => setAnchorEl(event.currentTarget)}
            >
                <Avatar
                    sx={{ backgroundColor: stringToColor(name), color: 'white' }}
                >{user?.sub.toUpperCase()[0]}</Avatar>
            </IconButton>
            <Menu
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            mt: 1.0,
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))'
                        }
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >

                <MenuItem onClick={() => { handleClose(); setSettingsOpen(true) }}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); logout(); }}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Log out
                </MenuItem>
            </Menu>
            <SettingsPage open={settingsOpen} onClose={settingsClose} />
        </>
    );
}

export default ProfileAvatar;
