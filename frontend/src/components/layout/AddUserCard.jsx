import { useState } from 'react';
import {
    Grid, Tooltip, Button, Dialog, Typography, DialogContent, Box, TextField,
    MenuItem, Snackbar, Alert, Paper, Slide
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { lightBlue } from '@mui/material/colors';

import { usePage } from '../../context/PageContext';
import apiClient from '../../api/client';

const OPTIONS_ROLE = ["Auditor", "Field Technician", "Clinical Admin"];

function AddUserCard() {

    const { triggerRefresh } = usePage();
    const [addDialog, setAddDialog] = useState(false);
    const [sbStatus, setSbStatus] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload = {
            username: formData.get("username"),
            password: formData.get("password"),
            role: formData.get("role")
        };
        try {
            const response = await apiClient.post("/auth/register", payload);
            // TODO: success displayed in snackbar somewhere on the screen
            setSbStatus({ type: 'success', message: `Successfully created User ${response.data.id}` });
        }
        catch (error) {
            // TODO: error displayed in snackbar somewhere on the screen
            console.error(error);
            setSbStatus({ type: 'error', message: `Failed to create User: ${error.message ?? ""}` });
        }
        finally {
            triggerRefresh();
            setAddDialog(false);
        }
    };

    return (
        <>
            <Grid key={'add-user'} sx={{ display: 'flex', width: 200, height: 140 }}>
                <Tooltip title="Add a User">
                    <Button
                        onClick={() => setAddDialog(true)}
                        sx={{
                            flex: 1,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(41,182,246,0.6)',
                            borderRadius: 1
                        }}
                    ><AddCircleIcon sx={{ color: lightBlue[100], width: 80, height: 80 }} /></Button>
                </Tooltip>
            </Grid>
            <Dialog open={addDialog} onClose={() => setAddDialog(false)}>
                <Paper
                    sx={{
                        backgroundColor: 'secondary',
                        p: 1,
                        m: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Typography
                        children={"Add User"}
                        color='text.primary'
                        variant='h5'
                    />
                </Paper>
                <DialogContent>
                    <Box
                        component='form'
                        onSubmit={(event) => handleSubmit(event)}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                            width: "100%",
                            maxWidth: 420,
                            p: 1,
                            pb: 0,
                        }}
                    >
                        <TextField
                            required
                            autoFocus
                            name="username"
                            label="Username"
                            variant='outlined'
                        />
                        <TextField
                            required
                            autoFocus
                            name="password"
                            label="Password"
                            type="password"
                            variant='outlined'
                        />
                        <TextField
                            required
                            autoFocus
                            name="role"
                            label="User Role"
                            variant='outlined'
                            select
                            fullWidth
                            defaultValue={OPTIONS_ROLE[0]}
                        >
                            {OPTIONS_ROLE.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <br />
                        <Button
                            type='submit'
                            variant='contained'
                        >
                            Submit
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
            <Snackbar
                open={sbStatus != null}
                sx={{ p: 0, m: 0 }}
                children={<Alert sx={{ m: 0 }} severity={sbStatus?.type}>{sbStatus?.message ?? "No Content"}</Alert>}
                onClose={() => setSbStatus(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                slots={{ transition: (props) => <Slide {...props} direction='down' /> }}
                autoHideDuration={3000}
            />
        </>
    );
}

export default AddUserCard;
