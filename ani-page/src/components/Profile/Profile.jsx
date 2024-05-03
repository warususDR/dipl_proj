import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import ItemList from "../Home/ItemList";
import { Box, Typography, Avatar } from "@mui/material";
import { usr_info, user_ratings_url } from "../../backendEndpoints";
import { ids_query, endpoint_url } from "../../anilistQueries";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [ratedAnime, setRatedAnime] = useState(null);

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
                    alert(data.error);
                }
            }).catch(err => {
                console.error('Error occured', err);
            }
        )
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
                    const api_result = fetchRatedAnime(ids);
                    console.log('api_res', api_result)
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
    }

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
                    alignItems='center'
                    justifyContent='center'
                    sx={{
                        width: '80%',
                        padding: 2,
                        backgroundColor: 'rgb(25, 118, 210)',
                        borderRadius: 5,
                        boxShadow: 3,
                    }}>
                    <Box display='flex' flexDirection='row' textAlign='center'>
                        <Avatar
                        alt={userData.nickname}
                        src={userData.avatar}
                        sx={{
                            width: 100,
                            height: 100,
                            marginRight: 4,
                            marginBottom: 2
                        }}/>
                        <Typography variant='h6' sx={{ fontFamily: 'Quicksand', marginBottom: 1, color: 'white', fontSize: 40 }}>
                            {userData.nickname}
                        </Typography>
                    </Box>
                    <Typography variant='h6' sx={{ fontFamily: 'Quicksand', color: 'white' }}>
                        Email: {userData.email}
                    </Typography>
                    <Typography variant='h6' sx={{ fontFamily: 'Quicksand', color: 'white' }}>
                        Date of birth: {new Date(userData.birth_date).toLocaleDateString('uk-UA')}
                    </Typography>
                    <Typography variant='h6' sx={{ fontFamily: 'Quicksand', color: 'white' }}>
                        Gender: {userData.gender}
                    </Typography>
                    {ratedAnime && <Box>
                        <Typography variant='h5' sx={{ fontFamily: 'Quicksand', color: 'white', marginBottom: '10px' }}>
                            Anime you rated recently:
                        </Typography>
                        <ItemList itemList={ratedAnime} showTitle={false}></ItemList>
                    </Box>}
                </Box>
            </Box>}
        </Box>
    );
}
 
export default Profile;