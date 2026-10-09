import { useMemo } from "react";
import { Toolbar, Button, AppBar, Box, Typography, Chip } from "@mui/material";
import { Person } from '@mui/icons-material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';

import { useAuth } from "../../context/AuthContext.jsx";
import { usePage } from "../../context/PageContext.jsx";

import ProfileAvatar from "./ProfileAvatar.jsx";
import TechnicianPage from "../pages/TechnicianPage.jsx";
import AdminPage from "../pages/AdminPage.jsx";

function AppHeader() {
    const { user, logout } = useAuth();
    const { frontPage, screen, setScreen } = usePage();

    const shortRole = useMemo(() => {
        let role = "";
        switch (user?.role) {
            case "Clinical Admin":
                role = "Admin";
                break;
            case "Field Technician":
                role = "Technician";
                break;
        }
        return role;
    }, [user]);

    const changeScreen = (role) => {
        let specialScreen = undefined;
        if (shortRole === "Admin") {
            specialScreen = <AdminPage />;
        } else if (shortRole === "Technician") {
            specialScreen = <TechnicianPage />;
        }
        setScreen(specialScreen);
    }

    return (
        <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
            <Toolbar sx={{ gap: 2, display: 'flex' }}>
                <Box component={'span'} sx={{ ml: 0, flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
                    <Button
                        startIcon={<LocalPharmacyIcon sx={{ gap: 2 }} />}
                        onClick={() => setScreen(frontPage)}
                        sx={{ color: 'primary.contrastText' }}
                    >
                        Medflow
                    </Button>
                </Box>
                <Box component={'span'} sx={{ flex: 3 }}>
                    {shortRole != "" && <Button onClick={() => changeScreen(shortRole)}>
                        <Chip
                            label={`${shortRole} Page`}
                            variant="outlined"
                            sx={{ border: 2, borderColor: 'secondary.dark', backgroundColor: 'primary.light' }}
                        />
                    </Button>}
                </Box>
                <Box component={'span'}
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <ProfileAvatar />
                    {/*<Person sx={{ mr: 0 }} />*/}
                    {/*<Typography sx={{ ml: 0 }} variant='body2'>{user?.sub} ({user?.role})</Typography>*/}
                    {/*<Button color='inherit' onClick={logout}>Log out</Button>*/}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default AppHeader;
