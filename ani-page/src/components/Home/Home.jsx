import Navbar from "../Navbar/Navbar";
import { Box, Typography } from "@mui/material";
import ItemList from "./ItemList";
import ItemRow from "./ItemRow";

const Home = () => {
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
                <Typography variant='h5' sx={{ fontFamily: 'Quicksand', marginTop: 3, marginBottom: 2, color: 'white', fontWeight: 'bold' }}>
                    Recommended for you
                </Typography>
                <Box
                    sx={{
                        width: '95%',
                        padding: 2,
                        backgroundColor: 'rgb(97, 97, 97)',
                        borderRadius: 5,
                        boxShadow: 3,
                    }}>
                    <ItemList />
                </Box>
                <Typography variant='h5' sx={{ fontFamily: 'Quicksand', marginTop: 3, marginBottom: 2, color: 'white', fontWeight: 'bold' }}>
                    Best picks for every taste
                </Typography>
                <Box
                    sx={{
                        width: '95%',
                        padding: 2,
                        backgroundColor: 'rgb(97, 97, 97)',
                        borderRadius: 5,
                        boxShadow: 3,
                    }}>
                    <ItemList />
                </Box>
                <Typography variant='h5' sx={{ fontFamily: 'Quicksand', marginTop: 3, marginBottom: 2, color: 'white', fontWeight: 'bold' }}>
                    Browse our library
                </Typography>
                <Box
                    sx={{
                        width: '99%',
                        padding: 2,
                        backgroundColor: 'rgb(97, 97, 97)',
                        borderRadius: 5,
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