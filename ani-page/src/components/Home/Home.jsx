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
                    paddingTop: '1vh',
                    paddingX: 3,
                }}>
                <Typography variant='h5' sx={{ fontFamily: 'Quicksand', marginTop: 3, marginBottom: 2, color: 'white', fontWeight: 'bold' }}>
                    Recommended for you
                </Typography>
                <Box
                    sx={{
                        width: '90%',
                        padding: 2,
                        backgroundColor: 'rgba(25, 118, 210, 0.8)',
                        borderRadius: 5,
                        boxShadow: 3,
                    }}>
                    <ItemList />
                </Box>
                <Typography variant='h5' sx={{ fontFamily: 'Quicksand', marginTop: 3, marginBottom: 2, color: 'white', fontWeight: 'bold' }}>
                    Best pics for every taste
                </Typography>
                <Box
                    sx={{
                        width: '90%',
                        padding: 2,
                        backgroundColor: 'rgba(25, 118, 210, 0.8)',
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
                        width: '95%',
                        padding: 2,
                        backgroundColor: 'rgba(25, 118, 210, 0.8)',
                        borderRadius: 5,
                        boxShadow: 3,
                    }}>
                    <ItemRow />
                </Box>
            </Box>
        </div>
     );
}
 
export default Home;