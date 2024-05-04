import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import ItemList from "../Home/ItemList";
import { Box, Typography, Avatar, Button, Dialog, TextField, FormControl, DialogTitle, DialogContent, InputLabel, Select, MenuItem, DialogActions } from "@mui/material";
import { usr_info, user_ratings_url, user_update_url } from "../../backendEndpoints";
import { ids_query, genres_query, endpoint_url } from "../../anilistQueries";
import { useNavigate } from "react-router-dom";
import { login_route } from "../Router/Routes";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [ratedAnime, setRatedAnime] = useState(null);

    const [description, setDescription] = useState('');
    const [preferredGenres, setPreferredGenres] = useState([]);
    const [genres, setGenres] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetch(usr_info, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
            },
            }).then(res => {
                return res.json()
            }).then(data => {
                if(data.hasOwnProperty('_id')) {
                   setUserData(data)
                }
                else {
                    navigate(login_route);
                }
            }).catch(err => {
                console.error('Error occured', err);
            }
        )
    }, [description, preferredGenres])

    useEffect(() => {
        fetch(user_ratings_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
            },
            }).then(res => {
                return res.json()
            }).then(async data => {
                if(!data.hasOwnProperty('error') && !data.hasOwnProperty('no-rating')) {
                    const ids = data.map(rating => rating.content_id);
                    const api_result = fetchRatedAnime(ids);
                    setRatedAnime(api_result);
                }
            }).catch(err => {
                console.error('Error occured', err);
            }
        )
    }, [])

    const fetchRatedAnime = anime_ids => {
        fetch(endpoint_url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'},
            body: JSON.stringify({
            query: ids_query,
            variables: { ids: anime_ids }
            })
        },
        )
        .then((response) => {return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
        });})
        .then((response) => {
            setRatedAnime(response.data.Page.media);
        }).catch(error => console.error('Error occured!', error))
    };

    const handleFormSubmit = event => {
        fetch(user_update_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
            },
            body: JSON.stringify({ description, favorite_genres: preferredGenres })
            }).then(res => {
                return res.json()
            }).then(data => {
                if(data.hasOwnProperty('error')) {
                   console.log(data);
                }
                else handleDialogClose();
            }).catch(err => {
                console.error('Error occured', err);
            }
        )
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = () => {
        fetch(endpoint_url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'},
            body: JSON.stringify({
            query: genres_query,
            })
        },
        )
        .then((response) => {return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
        });})
        .then((response) => {
            setGenres(response.data.GenreCollection);
        }).catch(error => console.error('Error occured!', error))
    };

    return (
        <Box>
            <Navbar />
            {userData && <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                sx={{
                    paddingTop: '4vh',
                    paddingX: 3,
                }}
            >
                <Typography variant='h4' sx={{ fontFamily: 'Quicksand', marginBottom: 2, color: 'white', fontWeight: 'bold' }}>
                    Your Profile
                </Typography>
                <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='left'
                    justifyContent='center'
                    sx={{
                        width: '80%',
                        padding: 2,
                        backgroundColor: 'rgb(66, 66, 66)',
                        borderRadius: 5,
                        boxShadow: 3,
                    }}>
                    <Box display='flex' flexDirection='row' textAlign='left' sx={ {margin: '10px'} }>
                        <Avatar
                        alt={userData.nickname}
                        src={userData.avatar}
                        sx={{
                            width: 100,
                            height: 100,
                            marginRight: 4,
                            marginBottom: 2
                        }}/>
                        <Box display='flex' justifyContent='left' flexDirection='column' sx={ {marginLeft: '5vh'} }>
                            <Typography variant='h6' sx={{ fontFamily: 'Quicksand', marginBottom: 1, color: 'white', fontSize: 40 }}>
                                {userData.nickname}
                            </Typography>
                            <Typography variant='h6' sx={{ fontFamily: 'Quicksand', color: 'white' }}>
                                Email: {userData.email}
                            </Typography>
                            <Typography variant='h6' sx={{ fontFamily: 'Quicksand', color: 'white' }}>
                                Date of birth: {new Date(userData.birth_date).toLocaleDateString('uk-UA')}
                            </Typography>
                            <Typography variant='h6' sx={{ fontFamily: 'Quicksand', color: 'white' }}>
                                Gender: {userData.gender}
                            </Typography>
                        </Box>
                    </Box>
                    {userData.description && <Box>
                        <Typography variant='h6' sx={{ fontFamily: 'Quicksand', color: 'white', marginBottom: '10px' }}>
                            Description: {userData.description}
                        </Typography>
                        <Typography variant='h6' sx={{ fontFamily: 'Quicksand', color: 'white', marginBottom: '10px' }}>
                            Genres you like: {userData.favorite_genres.join(', ')}
                        </Typography>
                    </Box>}
                    <Button
                            onClick = {handleDialogOpen}
                            variant='contained'
                            sx={{ marginTop: '10px', marginBottom: '10px', fontFamily: 'Quicksand' }}
                        >
                            {userData.description ?  'Update preferences' : 'Click if you want to help us know more about you'}
                    </Button>
                    {ratedAnime && <Box>
                        <Typography variant='h5' sx={{ fontFamily: 'Quicksand', color: 'white', marginBottom: '10px' }}>
                            Anime you rated recently:
                        </Typography>
                        <ItemList itemList={ratedAnime} showTitle={false}></ItemList>
                    </Box>}
                </Box>
            </Box>}

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Set Your Preferences</DialogTitle>
                <DialogContent>
                    <Box display='flex' flexDirection='column' marginBottom={2}>
                        <TextField
                            label='Description'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            margin='normal'
                        />
                        <FormControl margin='normal' required>
                            <InputLabel>Preferred Genres</InputLabel>
                            <Select
                                multiple
                                value={preferredGenres}
                                onChange={e => setPreferredGenres(e.target.value)}
                            >
                                {genres.map(genre => (
                                    <MenuItem key={genre} value={genre}>
                                        {genre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color='primary'>
                        Cancel
                    </Button>
                    <Button onClick={handleFormSubmit} color='primary'>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
 
export default Profile;