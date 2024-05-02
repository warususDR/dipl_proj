import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { Box, Typography, Avatar } from "@mui/material";
import { usr_info } from "../../backendEndpoints";

const Profile = () => {
    const [userData, setUserData] = useState(null);

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
                </Box>
            </Box>}
        </Box>
    );
}
 
export default Profile;