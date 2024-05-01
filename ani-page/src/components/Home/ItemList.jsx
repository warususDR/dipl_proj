import { Box } from "@mui/material";
import ItemElem from "./ItemElem";

const ItemList = ({itemList, showTitle}) => {

    return (
        <Box
            display='flex'
            flexDirection='row'
            flexWrap='wrap'
            gap={2}
        >
            {itemList.map((item, index) => (
               <ItemElem 
                    key={index} 
                    name={item.title.english ? item.title.english : item.title.romaji} 
                    image={item.coverImage.large} 
                    item_id={item.id} 
                    showTitle={showTitle}>
               </ItemElem>
            ))}
        </Box>
    );
}

export default ItemList;
