import { Container, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { login_route } from "../Router/Routes";
import CustomTextField from "../Custom/CustomTextField";
import { useState } from "react";
import { signup_url } from "../../backendEndpoints";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [birth_date, setDateOfBirth] = useState(new Date());
    const [gender, setGender] = useState('');
    const navigate = useNavigate();

    const SignUp = (event) => {
        if(confirm_password !== password) {
            alert("Passwords don't match!");
            return;
        }
        event.preventDefault()
        fetch(signup_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password, nickname, birth_date, gender})
            }).then(res => {
                return res.json()
            }).then(data => {
                navigate(login_route)
            }).catch(err => {
                console.error('Error occured', err);
            }
        )

    };

    const handleGenderChange = (event) => {
        setGender(event.target.value)
    }

    return (  
        <Container maxWidth='sm'>
            <Box 
                display='flex' 
                alignItems='center' 
                flexDirection='column'
                justifyContent='center'
                sx={{ backgroundColor: 'rgba(25, 118, 210, 0.8)', borderRadius: 5, boxShadow: 3, padding: 3, marginTop: '10vh' }}>
                <Typography variant='h4' sx={{fontFamily: 'QuickSand', color: 'white'}}>Register on Ani-World</Typography>
                <Box 
                    component='form'
                    onSubmit={SignUp} 
                    alignItems='center' 
                    display='flex' 
                    flexDirection='column' 
                    justifyContent='center'>
                    <CustomTextField placeholder='Enter email...' type='email' autoComplete='email' onChange={setEmail}>
                    </CustomTextField>
                    <CustomTextField placeholder='Enter nickname...' type='text' autoComplete='nickname' onChange={setNickname}></CustomTextField>
                    <CustomTextField 
                        placeholder='Enter your date of birth...' 
                        type='date' 
                        autoComplete='date_of_birth' 
                        onChange={setDateOfBirth}>
                    </CustomTextField>
                    <CustomTextField placeholder='Enter password...' type='password' autoComplete='password' onChange={setPassword}>
                    </CustomTextField>
                    <CustomTextField 
                        placeholder='Confirm password...' 
                        type='password' 
                        autoComplete='password' 
                        onChange={setConfirmPassword}>
                    </CustomTextField>
                    <FormControl 
                        variant='outlined' 
                        margin='normal' 
                        required
                        sx={{ width: '100%',  
                              '& .MuiInputLabel-root': {
                                    color: 'white',
                                    fontFamily: 'Quicksand',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'white',
                                    fontFamily: 'Quicksand',
                                },
                                '& .MuiSelect-select': {
                                    color: 'white',
                                    fontFamily: 'Quicksand',
                                },
                                '& .MuiSvgIcon-root': {
                                    color: 'white',
                                    fontFamily: 'Quicksand',
                                }, 
                            }}>
                        <InputLabel id="gender-label">Gender</InputLabel>
                        <Select
                            labelId="gender-label"
                            id="gender-select"
                            value={gender}
                            onChange={handleGenderChange}
                            label="Gender">
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                        </Select>
                    </FormControl>
                    <Button 
                    type='submit' 
                    sx={{fontFamily: 'QuickSand', 
                         backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                         margin: '16px',
                         '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        },}}>
                        Sign Up
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
                    to={login_route}>
                    Already have an account? Click here to log in
                </Button>
            </Box>
        </Container>
    );
}
 
export default SignUp;