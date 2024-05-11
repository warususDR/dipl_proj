import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import CharsList from "./CharsList";
import { updateAction, fetchAnimeByIds } from "../../utils";
import { Box, Typography, Button, Rating } from "@mui/material";
import { useState, useEffect } from "react";
import { endpoint_url, id_query } from "../../anilistQueries";
import { rate_url, content_rating_url, content_similar_url } from "../../backendEndpoints";
import { Link } from "react-router-dom";
import { stripHtml } from "../../utils";
import ItemList from "../Home/ItemList";

const ItemPage = () => {
    const { item_id } = useParams()
    const [showDescription, setShowDescription] = useState(false);
    const [animeData, setAnimeData] = useState(null);
    const [rating, setRating] = useState(null);
    const [similarAnime, setSimilarAnime] = useState(null)

    const handleRatingChange = (event, newRating) => {
        setRating(newRating);
        fetch(rate_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
            },
            body: JSON.stringify({content_id: item_id, rating_value: newRating})
            }).then(res => {
                return res.json()
            }).then(data => {
                if(data.hasOwnProperty('error')) {
                    alert(data.error);
                }
                console.log(data);
            }).catch(err => {
                console.error('Error occured', err);
            }
        )
        updateAction(item_id, 1);
    }

    useEffect(() => {
        fetch(`${content_rating_url}${item_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
            },
            }).then(res => {
                return res.json()
            }).then(data => {
                if(data.hasOwnProperty('rating')) {
                    setRating(data.rating);
                }
            }).catch(err => {
                console.error('Error occured', err);
            }
        )
    }, [item_id])

    const getSimilarAnimeIds = animeData => {
        fetch(content_similar_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(animeData)
            }).then(res => {
                return res.json()
            }).then(data => {
                if(data.hasOwnProperty('error')) {
                    console.log(data)
                }
                else fetchAnimeByIds(data.similar.recs, setSimilarAnime)
            }).catch(err => {
                console.error('Error occured', err);
            }
        )
    };

    useEffect(() => {
       fetch(endpoint_url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'},
                body: JSON.stringify({
                query: id_query,
                variables: { id: item_id }
                })
            },
            )
        .then((response) => {return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
        });})
        .then((response) => {
            setAnimeData(response.data.Media);
            getSimilarAnimeIds(response.data.Media);
        }).catch(error => console.error('Error occured!', error))
    }, [item_id]);

    const toggleDescription = () => {
        if(!showDescription) {
            updateAction(item_id, 2);
        }
        setShowDescription((prev) => !prev);
    };

    return (  
        <div>
            <Navbar />
            {animeData && <Box
                display='flex'
                flexDirection='column'
                alignItems='left'
                justifyContent='left'
                sx={{
                    paddingTop: '10vh',
                    paddingX: 3,
                }}>
                <Box
                    display='flex'
                    flexDirection='row'
                    alignItems='left'
                    justifyContent='left'
                    sx={{
                        width: '95%',
                        padding: 2,
                    }}>
                    <img 
                        src={animeData.coverImage.extraLarge}
                        alt={animeData.title.english} 
                        style={{
                        width: 'auto',
                        height: '400px',
                        objectFit: 'cover'}}
                    />
                    <Box
                        display='flex'
                        flexDirection='column'
                        alignItems='left'
                        justifyContent='left'>
                        <Typography variant='h4' sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 10, color: 'white' }}>
                            {animeData.title.english ? animeData.title.english : animeData.title.romaji} 
                        </Typography>
                        <Typography variant='h6' sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 10, color: 'white' }}>
                            Year: {animeData.seasonYear}
                        </Typography>
                        <Typography variant='h6' sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 10, color: 'white' }}>
                            Episodes: {animeData.episodes}
                        </Typography>
                        <Typography variant='h6' sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 10, color: 'white' }}>
                            Status: {animeData.status}
                        </Typography>
                        <Typography variant='h6' sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 10, color: 'white' }}>
                            Source: {animeData.source}
                        </Typography>
                        <Typography variant='h6' sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 10, color: 'white' }}>
                            Genres: {animeData.genres.join(', ')}
                        </Typography>
                        <Typography variant='h6' sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 10, color: 'white' }}>
                            Studio: {animeData.studios.nodes[0].name}
                        </Typography>
                        <Box sx={{ marginLeft: 10, marginBottom: 2 }}>
                            <Typography variant='h6' sx={{ fontFamily: 'Quicksand', color: 'white' }}>
                                Rate this anime:
                            </Typography>
                            <Rating 
                                onChange={handleRatingChange}
                                value={rating}
                                name={`${item_id}_rating`} 
                                max={10} 
                                sx={{
                                    '& .MuiRating-iconEmpty': {
                                        color: 'white'
                                    },
                                }} 
                            />
                        </Box>
                        <Button
                            variant='contained'
                            onClick={toggleDescription}
                            sx={{ marginBottom: 2, marginLeft: 10, fontFamily: 'Quicksand' }}
                        >
                            {showDescription ? 'Show less...' : 'Find out more...'}
                        </Button>
                        {showDescription && (
                            <Typography 
                                variant='h6' 
                                sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 10, color: 'white' }}>

                                {stripHtml(animeData.description)}
                            </Typography>
                        )}
                    </Box>
                </Box>
                {animeData.trailer && animeData.trailer.site==='youtube' && 
                <Typography 
                    variant='h5' 
                    sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 2, color: 'white' }}
                    component={Link}
                    to={`https://www.youtube.com/watch?v=${animeData.trailer.id}`} onClick={e => updateAction(item_id, 3)}>

                    Click here to view the trailer 
                </Typography>}
                {similarAnime && <Box> 
                    <Typography 
                        variant='h4' 
                        sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 2, color: 'white' }}>
                        Similar Anime: 
                    </Typography>
                    <ItemList itemList={similarAnime} showTitle={true}></ItemList>
                </Box>}
                <Typography 
                    variant='h4' 
                    sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 2, color: 'white' }}>
                    Characters: 
                </Typography>
                <CharsList charsList={animeData.characters.nodes}></CharsList>
            </Box>}
        </div>
    );
}
 
export default ItemPage;