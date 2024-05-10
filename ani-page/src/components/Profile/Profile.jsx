import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import ItemList from "../Home/ItemList";
import { Box, Typography, Avatar, Button, Dialog, TextField, FormControl, DialogTitle, DialogContent, InputLabel, Select, MenuItem, DialogActions } from "@mui/material";
import { usr_info, user_ratings_url, user_update_url, user_prefs_url } from "../../backendEndpoints";
import { ids_query, genres_query, endpoint_url } from "../../anilistQueries";
import { useNavigate } from "react-router-dom";
import { login_route } from "../Router/Routes";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [ratedAnime, setRatedAnime] = useState(null);
    const [preferredAnimeByDesc, setPreferredAnimeByDesc] = useState(null);
    const [preferredAnimeByGenre, setPreferredAnimeByGenre] = useState(null);
    const [description, setDescription] = useState('');
    const [preferredGenres, setPreferredGenres] = useState([]);
    const [genres, setGenres] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    const navigate = useNavigate();

    const fetchUsrInfo = () => {
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
    };

    useEffect(() => {
        fetchUsrInfo()
    }, [])

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
                    fetchAnimeByIds(ids, setRatedAnime);
                }
            }).catch(err => {
                console.error('Error occured', err);
            }
        )
    }, [])

    const fetchAnimeByIds = (anime_ids, setFunc) => {
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
            setFunc(response.data.Page.media);
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
                else {
                    handleDialogClose();
                    fetchUsrInfo();
                    fetchPrefs();
                }
            }).catch(err => {
                console.error('Error occured', err);
            }
        )
    };

    const fetchPrefs = () => {
        fetch(user_prefs_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
            },
            }).then(res => {
                console.log('res', res)
                return res.json()
            }).then(data => {
                if(data.hasOwnProperty('error')) {
                   console.log(data);
                }
                else {
                    fetchAnimeByIds(data.prefs.descript_recs, setPreferredAnimeByDesc) 
                    fetchAnimeByIds(data.prefs.genre_recs, setPreferredAnimeByGenre)            
                }
            }).catch(err => {
                console.error('Error occured', err);
        })
    }

    useEffect(() => {
        fetchPrefs()
    }, [])

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
                    {userData.description && userData.favorite_genres && <Box>
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
                    {preferredAnimeByDesc && preferredAnimeByGenre && <Box>
                        <Typography variant='h5' sx={{ fontFamily: 'Quicksand', color: 'white', marginBottom: '10px' }}>
                            What you might enjoy based on genres you like:
                        </Typography>
                        <ItemList itemList={preferredAnimeByGenre} showTitle={true}></ItemList>
                        <Typography variant='h5' sx={{ fontFamily: 'Quicksand', color: 'white', marginBottom: '10px' }}>
                            What might have something similar to your description:
                        </Typography>
                        <ItemList itemList={preferredAnimeByDesc} showTitle={true}></ItemList>
                    </Box>}
                    {ratedAnime && <Box>
                        <Typography variant='h5' sx={{ fontFamily: 'Quicksand', color: 'white', marginBottom: '10px' }}>
                            Anime you rated recently:
                        </Typography>
                        <ItemList itemList={ratedAnime} showTitle={false}></ItemList>
                    </Box>}
                </Box>
            </Box>}

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle sx={{ fontFamily: 'Quicksand' }}>Set Your Preferences</DialogTitle>
                <DialogContent>
                    <Box display='flex' flexDirection='column' marginBottom={2}>
                        <TextField
                            label='Description'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            margin='normal'
                             sx={{
                                '& .MuiInputBase-root': {
                                    fontFamily: 'Quicksand', 
                                },
                                '& .MuiInputLabel-root': {
                                    fontFamily: 'Quicksand', 
                                }
                            }}
                        />
                        <FormControl variant="outlined" margin='normal' required>
                            <InputLabel id='genres_label' sx={{ fontFamily: 'Quicksand' }}>Preferred Genres</InputLabel>
                            <Select
                                labelId='genres_label'
                                label='Preferred Genres'
                                multiple
                                value={preferredGenres}
                                onChange={e => setPreferredGenres(e.target.value)}
                                sx={{
                                    '& .MuiSelect-select': {
                                        fontFamily: 'Quicksand',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        fontFamily: 'Quicksand',
                                    }
                                }}
                            >
                                {genres.map(genre => (
                                    <MenuItem key={genre} value={genre} sx={{ fontFamily: 'Quicksand' }}>
                                        {genre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color='primary' sx={{ fontFamily: 'Quicksand' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleFormSubmit} color='primary' sx={{ fontFamily: 'Quicksand' }}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
 
export default Profile;