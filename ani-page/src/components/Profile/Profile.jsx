import Navbar from "../Navbar/Navbar";
import { Box, Typography, Avatar } from "@mui/material";

const Profile = () => {
    const nickname = 'AniMaster';
    const email = 'animaster@example.com';
    const profilePicUrl = '';

    return (
        <div>
            <Navbar />
            <Box
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
                        alt={nickname}
                        src={profilePicUrl}
                        sx={{
                            width: 100,
                            height: 100,
                            marginRight: 4,
                            marginBottom: 2
                        }}/>
                        <Typography variant='h6' sx={{ fontFamily: 'Quicksand', marginBottom: 1, color: 'white', fontSize: 40 }}>
                            {nickname}
                        </Typography>
                    </Box>
                    <Typography variant='h6' sx={{ fontFamily: 'Quicksand', color: 'white' }}>
                        Email: {email}
                    </Typography>
                </Box>
            </Box>
        </div>
    );
}
 
export default Profile;