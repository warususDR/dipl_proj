import Navbar from "../Navbar/Navbar";
import { Box, Typography } from "@mui/material";
import ItemList from "./ItemList";
import ItemRow from "./ItemRow";
import { useState, useEffect } from "react";
import { all_query, endpoint_url } from "../../anilistQueries";

const Home = () => {
    const [animeData, setAnimeData] = useState([]);

    useEffect(() => {
       fetch(endpoint_url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'},
                body: JSON.stringify({
                query: all_query,
                })
            },
            )
        .then((response) => {return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
        });})
        .then((response) => {
            setAnimeData(response.data.Page.media);
        }).catch(error => console.error('Error occured!', error))
    }, []);

    return ( 
        <div>
            <Navbar />
            <Box
                display='flex'
                flexDirection='column'
                alignItems='left'
                justifyContent='center'
                sx={{
                    paddingTop: '8vh',
                    paddingX: 3,
                }}>
                <Typography variant='h5' sx={{ fontFamily: 'Quicksand', marginTop: 3, marginBottom: 3, color: 'white', fontWeight: 'bold' }}>
                    Recommended for you
                </Typography>
                <Box
                    sx={{
                        width: '95%',
                        padding: 2,
                        backgroundColor: 'rgb(66, 66, 66)',
                        borderRadius: 3,
                        boxShadow: 3,
                    }}>
                    <ItemList itemList={animeData} />
                </Box>
                <Typography variant='h5' sx={{ fontFamily: 'Quicksand', marginTop: 3, marginBottom: 3, color: 'white', fontWeight: 'bold' }}>
                    Best picks for every taste
                </Typography>
                <Box
                    sx={{
                        width: '95%',
                        padding: 2,
                        backgroundColor: 'rgb(66, 66, 66)',
                        borderRadius: 3,
                        boxShadow: 3,
                    }}>
                    <ItemList itemList={animeData}/>
                </Box>
                <Typography variant='h5' sx={{ fontFamily: 'Quicksand', marginTop: 3, marginBottom: 2, color: 'white', fontWeight: 'bold' }}>
                    Browse our library
                </Typography>
                <Box
                    sx={{
                        width: '99%',
                        padding: 2,
                        backgroundColor: 'rgb(66, 66, 66)',
                        borderRadius: 3,
                        boxShadow: 3,
                        marginBottom: 3
                    }}>
                    <ItemRow />
                </Box>
            </Box>
        </div>
     );
}
 
export default Home;