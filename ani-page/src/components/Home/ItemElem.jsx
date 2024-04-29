import { Typography, Box } from "@mui/material";

const ItemElem = ({name, image, item_index}) => {
    return (  
        <Box
            key={item_index} 
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            sx={{
                width: '150px', 
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
 
export default ItemElem;