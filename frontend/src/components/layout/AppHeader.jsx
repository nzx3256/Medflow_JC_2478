import { Toolbar, Button, AppBar, Box, Typography } from "@mui/material";
import { Person, } from '@mui/icons-material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';

import { useAuth } from "../../context/AuthContext.jsx";
import { usePage } from "../../context/PageContext.jsx";
import { red } from '@mui/material/colors';

function AppHeader() {
    const { user, logout } = useAuth();
    const { frontPage, setScreen } = usePage();
    return (
        <AppBar position="static" sx={{ backgroundColor: red[300] }}>
            <Toolbar sx={{ gap: 2 }}>
                <Box component={'span'} sx={{ ml: 0 }}>
                    <Button startIcon={<LocalPharmacyIcon sx={{ gap: 2 }} />} onClick={() => setScreen(frontPage)} sx={{ color: 'white' }}>
                        Medflow
                    </Button>
                </Box>
                <Box component={'span'} sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                    <Person sx={{ mr: 0 }} />
                    <Typography sx={{ ml: 0 }} variant='body2'>{user?.sub} ({user?.role})</Typography>
                    <Button color='inherit' onClick={logout}>Log out</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default AppHeader;
