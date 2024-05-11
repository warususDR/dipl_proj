import Navbar from "../Navbar/Navbar";
import { Box, Button, Typography } from "@mui/material";
import ItemList from "./ItemList";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { all_query, popular_query, endpoint_url } from "../../anilistQueries";
import { user_personal_recs } from "../../backendEndpoints";
import { login_route } from "../Router/Routes";
import { fetchAnimeByIds } from "../../utils";

const Home = () => {
    const [popularData, setPopularData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [recAnime, setRecAnime] = useState(null);
    const [currentPage, setCurrentPage] = useState(() => {
        const savedPage = localStorage.getItem('currentPage');
        return savedPage ? parseInt(savedPage) : 1;
    });
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const fetchRecs = () => {
        fetch(user_personal_recs, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
            },
            }).then(res => {
                return res.json()
            }).then(data => {
                if(data.hasOwnProperty('error')) {
                   console.log(data);
                }
                else { 
                    fetchAnimeByIds(data.recs.collab_recs, setRecAnime);           
                }
            }).catch(err => {
                console.error('Error occured', err);
        })
    }

    useEffect(() => {
        if(!localStorage.getItem('jwt_token')) {
            navigate(login_route)
        }
    }, [navigate])

    useEffect(() => {
        fetchRecs()
    }, [])

    useEffect(() => {
       fetch(endpoint_url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'},
                body: JSON.stringify({
                query: popular_query,
                })
            },
            )
        .then((response) => {return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
        });})
        .then((response) => {
            setPopularData(response.data.Page.media);
        }).catch(error => console.error('Error occured!', error))
    }, []);

    useEffect(() => {
       fetch(endpoint_url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'},
                body: JSON.stringify({
                query: all_query,
                variables: { page: currentPage }
                })
            },
            )
        .then((response) => {return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
        });})
        .then((response) => {
            setAllData(response.data.Page.media);
            setTotalPages(response.data.Page.pageInfo.total);
        }).catch(error => console.error('Error occured!', error))
    }, [currentPage]);

     useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
    }, [currentPage]);

    return ( 
        <Box>
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
                {recAnime && <Typography variant='h5' sx={{ fontFamily: 'Quicksand', marginTop: 3, marginBottom: 3, color: 'white', fontWeight: 'bold' }}>
                    Recommended for you because of what you like:
                </Typography>}
                {recAnime && <Box
                    sx={{
                        width: '95%',
                        padding: 2,
                        backgroundColor: 'rgb(66, 66, 66)',
                        borderRadius: 3,
                        boxShadow: 3,
                    }}>
                    <ItemList itemList={recAnime} showTitle={true} />
                </Box>}
                <Typography variant='h5' sx={{ fontFamily: 'Quicksand', marginTop: 3, marginBottom: 3, color: 'white', fontWeight: 'bold' }}
                >
                    Top 25 most popular anime
                </Typography>
                <Box
                    sx={{
                        width: '95%',
                        padding: 2,
                        backgroundColor: 'rgb(66, 66, 66)',
                        borderRadius: 3,
                        boxShadow: 3,
                    }}
                >
                    {popularData && <ItemList itemList={popularData} showTitle={true}/>}
                </Box>
                <Typography variant='h5' sx={{ fontFamily: 'Quicksand', marginTop: 3, marginBottom: 2, color: 'white', fontWeight: 'bold' }}>
                    Browse our library
                </Typography>
                <Box
                    sx={{
                        width: '95%',
                        marginBottom: '2px'
                    }}
                >
                    <ItemList itemList={allData} showTitle={false} />
                </Box>
                <Box display='flex' justifyContent='center' flexDirection='row' alignItems='center' marginTop='2px'>
                    <Button 
                        variant='contained' 
                        onClick={handlePreviousPage} 
                        disabled={currentPage === 1} 
                        sx={{ fontFamily: 'Quicksand', margin: '10px'}}
                    >
                        Previous
                    </Button>
                    <Typography variant='body1' sx={{ color: 'white', fontFamily: 'Quicksand' }}>
                        Page {currentPage} of {totalPages}
                    </Typography>
                    <Button 
                    variant='contained' 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages}
                    sx={{ fontFamily: 'Quicksand', margin: '10px'}}
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        </Box>
     );
}
 
export default Home;