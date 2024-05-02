import { Link } from "react-router-dom";
import { home_route, profile_route, signup_route, login_route } from "../Router/Routes";
import { TextField, Button, AppBar, Toolbar, Typography, IconButton, InputAdornment, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Person2Icon from '@mui/icons-material/Person2';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { endpoint_url, search_query } from "../../anilistQueries";
import ItemList from "../Home/ItemList";

const Navbar = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchPopup, setShowSearchPopup] = useState(false); 
    const navigate = useNavigate();

    const logOut = (event) => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('page');
        navigate(login_route);
    }

    const handleSearchChange = (event) => {
        setShowSearchPopup(false);
        setSearchQuery(event.target.value);
    };

    const handleSearch = () => {
         if(searchQuery !== '') {
            fetch(endpoint_url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'},
                body: JSON.stringify({
                query: search_query,
                variables: { search: searchQuery }
                })
            },
            )
            .then((response) => {return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
            });})
            .then((response) => {
                setSearchResults(response.data.Page.media);
                setShowSearchPopup(true);
            }).catch(error => console.error('Error occured!', error))
        }
        else {
            setSearchResults([]);
        }
    }

    return ( 
        <AppBar position='fixed' sx={{ backgroundColor: 'rgb(25, 118, 210)' }}>
            <Toolbar>
                <Typography 
                    component={Link} 
                    to={home_route}
                    variant='h6' 
                    sx={{ flexGrow: 1, fontFamily: 'Quicksand', cursor: 'pointer', textDecoration: 'none', color: 'white' }}
                >
                    ANI-WORLD
                </Typography>
                <TextField
                    variant='outlined'
                    placeholder='Search anime'
                    size='small'
                    onChange={handleSearchChange}
                    InputProps={{
                        endAdornment: (
                        <InputAdornment position='end'>
                            <IconButton onClick={handleSearch}>
                                <SearchIcon style={{color: 'white', opacity: 0.7}} />
                            </IconButton>
                        </InputAdornment>
                        )
                    }}
                    sx={{ marginRight: 2, 
                          marginLeft: 2,
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
                <IconButton component={Link} to={profile_route}>
                    <Person2Icon style={{ color: 'white' }} />
                </IconButton>
                <Button color='inherit' sx={{ fontFamily: 'Quicksand' }} component={Link} to={signup_route}>
                    Sign Up
                </Button>
                 <Button color='inherit' sx={{ fontFamily: 'Quicksand' }} onClick={logOut}>
                    Log Out
                </Button>
            </Toolbar>
            {showSearchPopup && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '60px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        borderRadius: '10px',
                        padding: '10px',
                        width: '90%', 
                        maxHeight: '400px', 
                        overflowY: 'auto',
                    }}
                >
                    {(searchResults.length !== 0) && <ItemList itemList={searchResults} showTitle={true} />}
                    {(searchResults.length === 0) && <Typography variant="body1" sx={{ color: 'white', fontFamily: 'Quicksand'}}>
                        Nothing found!
                    </Typography>}
                    <Button
                        variant='contained'
                        onClick={() => {
                            setShowSearchPopup(false);
                            setSearchQuery('');
                        }}
                        sx={{ display: 'block', margin: '10px auto', fontFamily: 'Quicksand' }}
                    >
                        Close
                    </Button>
                </Box>
            )}
        </AppBar>
     );
}
 
export default Navbar;