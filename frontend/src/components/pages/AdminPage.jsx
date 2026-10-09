import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { lightBlue } from "@mui/material/colors";

import apiClient from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { usePage } from "../../context/PageContext";

import TechnicianPage from "./TechnicianPage";
import UserCard from "../layout/UserCard.jsx";
import AddUserCard from "../layout/AddUserCard.jsx";

function AdminPage() {
    const { user } = useAuth();
    const { frontPage, setScreen } = usePage();

    const [allUsers, setAllUsers] = useState([]);
    const [error, setError] = useState(null);
    const [addDialog, setAddDialog] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get("/users");
            setAllUsers(response.data);
        }
        catch {
            setError("Could not fetch User Data");
        }
    };
    if (user?.role == "Auditor") setScreen(frontPage);

    useEffect(() => {
        setError(null);
        if (user?.role == "Field Technician") {
            setScreen(<TechnicianPage />);
            return;
        }
        else if (user?.role == "Clinical Admin");
        fetchUsers();
    }, [user]);

    return (
        <>
            <Typography variant='h4' sx={{ color: 'text.primary' }}>
                Admin Page
            </Typography>
            <Box component='div' sx={{ width: '100%', display: 'flex', flex: 1 }}>
                {error && <Alert severity="error" children={error} />}
                {!error && <Grid container spacing={2}>
                    {allUsers.map((entry) => {
                        //console.log(entry);
                        return (
                            <Grid key={entry['id']} sx={{ display: 'flex', width: 200, height: 140 }}>
                                <UserCard entry={entry} />
                            </Grid>
                        );
                    })}
                    <AddUserCard />
                </Grid>}
            </Box >
        </>
    );
}

export default AdminPage;

