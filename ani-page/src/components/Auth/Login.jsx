import { Container, Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { profile_route, signup_route } from "../Router/Routes";
import CustomTextField from "../Custom/CustomTextField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login_url } from "../../backendEndpoints";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const LogIn = (event) => {
        event.preventDefault()
        fetch(login_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
            }).then(res => {
                return res.json()
            }).then(data => {
                if(data.hasOwnProperty('jwt_token')) {
                    localStorage.setItem('jwt_token', data.jwt_token);
                    navigate(profile_route);
                }
                else {
                    alert(data.error);
                }
            }).catch(err => {
                console.error('Error occured', err);
            }
        )
    };

    return (  
        <Container maxWidth='sm'>
            <Box 
                display='flex' 
                alignItems='center' 
                flexDirection='column' 
                justifyContent='center'
                sx={{ backgroundColor: 'rgba(25, 118, 210, 0.8)', borderRadius: 5, boxShadow: 3, padding: 3, marginTop: '20vh' }}>
                <Typography variant="h4" sx={{fontFamily: 'QuickSand', color: 'white'}}>Welcome to Ani-World!</Typography>
                <Box 
                    component='form' 
                    onSubmit={LogIn} 
                    alignItems='center' 
                    display='flex' 
                    flexDirection='column' 
                    justifyContent='center'>
                    <CustomTextField placeholder='Enter email...' type='email' autoComplete='email' onChange={setEmail}>
                    </CustomTextField>
                    <CustomTextField placeholder='Enter password...' type='password' autoComplete='password' onChange={setPassword}>
                    </CustomTextField>
                    <Button 
                    type='submit' 
                    sx={{fontFamily: 'QuickSand', 
                         backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                         margin: '16px',
                         '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        },}}>
                        Log In
                    </Button>
                </Box>
                <Button 
                    color='inherit'
                    sx={{ 
                        fontFamily: 'Quicksand', 
                        color: 'white', 
                        marginTop: 2 
                    }}
                    component={Link}
                    to={signup_route}>
                    Don't have an account? Click here to register
                </Button>
            </Box>
        </Container>
    );
}
 
export default Login;