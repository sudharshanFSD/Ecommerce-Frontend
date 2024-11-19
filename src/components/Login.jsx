import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Card, Container, CircularProgress, Snackbar, Alert, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import login from '../assets/login.png';

function Login({ onLogin }) {
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onFinish = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const values = {
            email: data.get('email'),
            password: data.get('password'),
        };

        setLoading(true);
        axios.post('https://ecommerce-1-33ey.onrender.com/apiAuth/login', values)
            .then(response => {
                onLogin(response.data.token, response.data.role);
                setSnackbarMessage('Login successful!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);

                setTimeout(() => {
                    navigate('/home');
                }, 2000); // 2-second delay
            })
            .catch(error => {
                const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials and try again.';
                setSnackbarMessage(errorMessage);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                console.error('Login failed:', errorMessage);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Container
            sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '16px',
            }}
        >
            <Grid container justifyContent="center">
                <Grid item xs={12} sm={10} md={8} lg={6}>
                    <Card
                        sx={{
                            padding: '24px',
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px',
                            maxWidth: '800px',
                            margin: '0 auto',
                            marginTop: {
                                xs: '0',
                                sm: '20px',
                                md: '20px',
                                lg: '130px',
                            },
                            paddingTop: { xs: '16px', md: '24px' },
                            paddingBottom: { xs: '16px', md: '24px' },
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <img
                                    src={login}
                                    alt="Login"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: '8px'
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="h4" align="center" gutterBottom>
                                    Login
                                </Typography>

                                <form onSubmit={onFinish}>
                                    <TextField
                                        name="email"
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required
                                        type="email"
                                    />

                                    <TextField
                                        name="password"
                                        label="Password"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={handleTogglePasswordVisibility}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        disabled={loading}
                                        sx={{ marginTop: 2 }}
                                    >
                                        {loading ? <CircularProgress size={24} /> : 'Log in'}
                                    </Button>
                                </form>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default Login;
