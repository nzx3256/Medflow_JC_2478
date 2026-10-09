import {
    Paper, Box, TextField, Button, Dialog, DialogTitle, DialogContent,
    Alert, Typography, Snackbar, Slide
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useRef } from "react";
import { useState } from "react";
import { red } from '@mui/material/colors';

function LoginPage() {
    const [status, setStatus] = useState(null);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const { login } = useAuth();

    async function handleSubmit(event) {
        event.preventDefault();
        setStatus(null);
        const username = usernameRef?.current?.value;
        const password = passwordRef?.current?.value;
        if (username != undefined && password != undefined) {
            try {
                await login(username, password);
            }
            catch {
                setStatus({ type: "error", message: "Invalid username or password" });
            }
        }
        else {
            setStatus("Username and Password are required fields");
        }
    }
    const elementSx = { m: 1 }
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <Paper
                component="form" onSubmit={(event) => handleSubmit(event)}
                sx={{ justifyContent: 'center', width: 300, pb: 1, borderRadius: 0 }}
            >
                <Box sx={{ backgroundColor: 'primary.main', p: 1, mb: 1, borderRadius: 0 }}>
                    <Typography variant="h6" sx={{
                        ...elementSx,
                        mt: 0,
                        color: 'primary.contrastText',
                        width: '100%',
                        justifyContent: 'center'
                    }}
                    > Medflow Login </Typography>
                </Box>
                <div>
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
                </div>
                <div>
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
                </div>
                <div>
                    <Button
                        type="submit"
                        children={"Log In"}
                        variant="contained"
                        sx={{ ...elementSx, backgroundColor: 'primary.dark' }}
                    />
                </div>
            </Paper>
            <Snackbar
                open={status != null}
                autoHideDuration={5000}

                slots={{
                    transition: (props) => <Slide {...props} direction="down" />
                }}
                sx={{ p: 0, m: 0 }}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={() => setStatus(null)}
            >
                <Alert
                    sx={{ m: 0 }}
                    severity={status?.type}
                    children={status?.message ?? "No Content"}
                />
            </Snackbar>
        </Box >
    );
}

export default LoginPage;
