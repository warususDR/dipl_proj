import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { Box, Typography, Button, Rating } from "@mui/material";
import { useState, useEffect } from "react";
import { endpoint_url, id_query } from "../../anilistQueries";
import { Link } from "react-router-dom";

const ItemPage = () => {
    const { item_id } = useParams()
    const [showDescription, setShowDescription] = useState(false);
    const [animeData, setAnimeData] = useState('');

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
        }).catch(error => console.error('Error occured!', error))
    }, [item_id]);

    const toggleDescription = () => {
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
                            {animeData.title.english} 
                        </Typography>
                        <Typography variant='h6' sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 10, color: 'white' }}>
                            Characters: {(animeData.characters.nodes.map(node => node.name.full)).join(', ')}
                        </Typography>
                        <Typography variant='h6' sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 10, color: 'white' }}>
                            Genre: {animeData.genres.join(', ')}
                        </Typography>
                        <Typography variant='h6' sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 10, color: 'white' }}>
                            Studio: {animeData.studios.nodes[0].name}
                        </Typography>
                         <Typography variant='h6' sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 10, color: 'white' }}>
                            Thumbnail: {animeData.trailer.id}
                        </Typography>
                        <Box sx={{ marginLeft: 10, marginBottom: 2 }}>
                            <Typography variant='h6' sx={{ fontFamily: 'Quicksand', color: 'white' }}>
                                Rate this movie:
                            </Typography>
                            <Rating 
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

                                {animeData.description}
                            </Typography>
                        )}
                    </Box>
                </Box>
                {animeData.trailer.site==='youtube' && 
                 <Typography 
                    variant='h4' 
                    sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 2, color: 'white' }}
                    component={Link}
                    to={`https://www.youtube.com/watch?v=${animeData.trailer.id}`}>

                    Click here to view the trailer 
                </Typography>}
            </Box>}
        </div>
    );
}
 
export default ItemPage;