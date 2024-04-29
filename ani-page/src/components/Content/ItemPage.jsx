import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { Box, Typography, Button, Rating } from "@mui/material";
import { useState } from "react";

const ItemPage = () => {
    const { item_id } = useParams()
    const [showDescription, setShowDescription] = useState(false);

    const movieData = {name: "Pirates of the Carribean", director: "Guy SOme Guy", writers: ["Jimmy", "Joe", "Jeremy"], stars: ["Depp", "Jeremia", "Joe"], description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis ultricies urna. Pellentesque blandit nulla ut mattis congue. Aenean fermentum tellus tortor. Etiam rutrum, elit in eleifend elementum, nunc diam pharetra leo, sit amet placerat dui sapien a elit. Sed lectus leo, sollicitudin varius magna et, consectetur vehicula nisi. Morbi varius libero felis, et tristique sapien euismod et. Nullam urna leo, sodales sed felis sit amet, eleifend posuere diam. Nam laoreet metus quis nulla volutpat varius. Fusce fermentum pretium nibh, vel luctus tellus accumsan varius. Aliquam ac sapien viverra, iaculis dui in, faucibus arcu. Praesent est nunc, egestas ut lorem eget, lobortis pellentesque tortor. Proin finibus augue eu pulvinar semper. Maecenas sed accumsan massa.", genres: ["adventure", "magic"]}
    const test_url = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.gF--XR-CwFzNmC-zfsJD1QHaKu%26pid%3DApi&f=1&ipt=816805543dd762d67ec59cdc3d7db760f2dc029269e4359f9a9d96c783474dd3&ipo=images'

    const toggleDescription = () => {
        setShowDescription((prev) => !prev);
    };

    return (  
        <div>
            <Navbar />
            <Box
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
                        src={test_url}
                        alt={movieData.name} 
                        style={{
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'cover'}}
                    />
                    <Box
                        display='flex'
                        flexDirection='column'
                        alignItems='left'
                        justifyContent='left'>
                        <Typography variant='h4' sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 10, color: 'white' }}>
                            {movieData.name} {item_id}
                        </Typography>
                        <Typography variant='h6' sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 10, color: 'white' }}>
                            Director: {movieData.director}
                        </Typography>
                        <Typography variant='h6' sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 10, color: 'white' }}>
                            Genres: {movieData.genres.join(', ')}
                        </Typography>
                        <Typography variant='h6' sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 10, color: 'white' }}>
                            Writers: {movieData.writers.join(', ')}
                        </Typography>
                        <Typography variant='h6' sx={{ fontFamily: 'Quicksand', marginBottom: 2, marginLeft: 10, color: 'white' }}>
                            Stars: {movieData.stars.join(', ')}
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

                                {movieData.description}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        </div>
    );
}
 
export default ItemPage;