import { useEffect } from "react";
import { Button, Typography } from "@mui/material";

import { useAuth } from "../../context/AuthContext";
import { usePage } from "../../context/PageContext";
import AdminPage from "./AdminPage";


function TechnicianPage() {
    const { user } = useAuth();
    const { setScreen } = usePage();
    useEffect(() => {
        if (user?.role == "Clinical Admin") {
            setScreen(<AdminPage />);
        }
        else if (user?.role == "Field Technician");
    }, [user]);
    if (user?.role == "Auditor") setScreen(frontPage);
    //console.log((<AdminPage />).type);
    return (
        <>
            <Typography variant='h4' sx={{ color: 'primary.contrastText' }}>
                Technician Page
            </Typography>
            <Button>
            </Button>
        </>
    );
}

export default TechnicianPage;
