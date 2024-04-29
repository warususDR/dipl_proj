import { Link } from "react-router-dom";
import { home_route, profile_route, signup_route, login_route } from "../Router/Routes";
import { TextField, Button, AppBar, Toolbar, Typography, IconButton, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Person2Icon from '@mui/icons-material/Person2';

const Navbar = () => {

     const handleSearchChange = (event) => {
        const searchValue = event.target.value;
        console.log('Search movie:', searchValue);
    };

    return ( 
        <AppBar position='static' sx={{ backgroundColor: 'rgba(25, 118, 210, 0.8)' }}>
            <Toolbar>
                <Typography variant='h6' sx={{ flexGrow: 1, fontFamily: 'Quicksand' }}>
                    ANI-WORLD
                </Typography>
                <TextField
                    variant='outlined'
                    placeholder='Search movie'
                    size='small'
                    onChange={handleSearchChange}
                    InputProps={{
                        endAdornment: (
                        <InputAdornment>
                            <IconButton>
                                <SearchIcon style={{color: 'white', opacity: 0.7}} />
                            </IconButton>
                        </InputAdornment>
                        )
                    }}
                    sx={{ marginRight: 2, 
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontFamily: 'Quicksand',
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                '& fieldset': {
                                    borderColor: 'white',
                                    borderWidth: 2,
                                },
                            },
                            '&.Mui-focused': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                '& fieldset': {
                                    borderColor: 'white',
                                },
                            },
                        },
                        input: {
                            color: 'white',
                            '&::placeholder': {  
                                opacity: 0.7,
                                fontWeight: 'bold'
                            },
                        }
                     }}
                />
                <Button color='inherit' sx={{ fontFamily: 'Quicksand' }} component={Link} to={home_route}>
                    Home
                </Button>
                <IconButton component={Link} to={profile_route}>
                    <Person2Icon style={{ color: 'white' }} />
                </IconButton>
                <Button color='inherit' sx={{ fontFamily: 'Quicksand' }} component={Link} to={signup_route}>
                    Sign Up
                </Button>
                 <Button color='inherit' sx={{ fontFamily: 'Quicksand' }} component={Link} to={login_route}>
                    Log Out
                </Button>
            </Toolbar>
        </AppBar>
     );
}
 
export default Navbar;