import { Typography, Box } from "@mui/material";

const CharElem = ({name, image}) => {

    return (  
        <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='left'
            marginRight='8px'
            sx={{
                width: '160px', 
                cursor: 'pointer',
                textDecoration: 'none',
            }}
        >
            <img
                src={image}
                alt={name}
                style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                }}
            />
            <Typography
                variant='h6'
                sx={{ fontFamily: 'Quicksand', color: 'white', textAlign: 'center' }}
            >
                {name}
            </Typography>
        </Box>
    );
}
 
export default CharElem;