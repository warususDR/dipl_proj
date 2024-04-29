import { Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { item_route } from "../Router/Routes";

const ItemElem = ({name, image, item_id}) => {

    return (  
        <Box component={Link} to={`${item_route}/${item_id}`}
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            sx={{
                width: '180px', 
                cursor: 'pointer',
                textDecoration: 'none'
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