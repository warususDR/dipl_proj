import { Container, Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { signup_route } from "../Router/Routes";
import CustomTextField from "../Custom/CustomTextField";
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const LogIn = (event) => {
        console.log(email, password);
    };

    return (  
        <Container maxWidth="sm">
            <Box 
                display="flex" 
                alignItems="center" 
                flexDirection="column" 
                justifyContent="center"
                sx={{ backgroundColor: 'rgba(25, 118, 210, 0.8)', borderRadius: 5, boxShadow: 3, padding: 3, marginTop: "20vh" }}>
                <Typography variant="h4" sx={{fontFamily: 'QuickSand', color: 'white'}}>Welcome to Ani-World!</Typography>
                <Box 
                    component="form" 
                    onSubmit={LogIn} 
                    alignItems="center" 
                    display="flex" 
                    flexDirection="column" 
                    justifyContent='center'>
                    <CustomTextField placeholder="Enter email" autoComplete="email" onChange={setEmail}></CustomTextField>
                    <CustomTextField placeholder="Enter password" autoComplete="password" onChange={setPassword}></CustomTextField>
                    <Button 
                    type="submit" 
                    sx={{fontFamily: 'QuickSand', backgroundColor: 'rgba(255, 255, 255, 0.7)', margin: '16px'}}>
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
                    to={signup_route}
                >
                    Don't have an account? Click here to register
                </Button>
            </Box>
        </Container>
    );
}
 
export default Login;