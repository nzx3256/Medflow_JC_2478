import {
    Paper, Box, TextField, Button, Dialog, DialogTitle, DialogContent,
    Alert, Typography, Snackbar, Slide
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useRef } from "react";
import { useState } from "react";
import { red } from '@mui/material/colors';

function LoginPage() {
    const [error, setError] = useState(null);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const { login } = useAuth();

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);
        const username = usernameRef?.current?.value;
        const password = passwordRef?.current?.value;
        if (username != undefined && password != undefined) {
            try {
                await login(username, password);
            }
            catch {
                setError("Invalid username or password");
            }
        }
        else {
            setError("Username and Password are required fields");
        }
    }
    const elementSx = { m: 1 }
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <Paper
                component="form" onSubmit={(event) => handleSubmit(event)}
                sx={{ justifyContent: 'center', width: 300, pb: 1, borderRadius: 0 }}
            >
                <Box sx={{ backgroundColor: red[300], p: 1, mb: 1, borderRadius: 0 }}>
                    <Typography variant="h6" sx={{
                        ...elementSx,
                        mt: 0,
                        color: 'white',
                        width: '100%',
                        justifyContent: 'center'
                    }}
                    > Medflow Login </Typography>
                </Box>
                <TextField
                    label="Username"
                    name="username"
                    type="text"
                    required={true}
                    inputRef={usernameRef}
                    sx={{
                        ...elementSx,
                    }}
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    required={true}
                    inputRef={passwordRef}
                    sx={{
                        ...elementSx,
                    }}
                />
                <Button
                    type="submit"
                    children={"Log In"}
                    variant="contained"
                    sx={{ ...elementSx, backgroundColor: red[400] }}
                />
            </Paper>
            <Snackbar
                open={error != null}
                autoHideDuration={5000}
                message={error ?? "No Content"}
                slots={{
                    transition: (props) => <Slide {...props} direction="down" />
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={() => setError(null)}
            >
            </Snackbar>
        </Box >
    );
}

export default LoginPage;
