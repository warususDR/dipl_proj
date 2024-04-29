import { Box } from "@mui/material";
import ItemElem from "./ItemElem";

const ItemList = ({itemList}) => {

    return (
        <Box
            display='grid'
            justifyContent='left'
            gap={3}
            gridTemplateColumns='repeat(auto-fit, minmax(200px, 1fr))'
            gridAutoFlow='row dense'
        >
            {itemList.map((item, index) => (
               <ItemElem key={index} name={item.title.english} image={item.coverImage.large} item_id={item.id} ></ItemElem>
            ))}
        </Box>
    );
}

export default ItemList;
