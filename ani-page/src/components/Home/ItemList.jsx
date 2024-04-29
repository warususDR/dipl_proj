import { Box } from "@mui/material";
import ItemElem from "./ItemElem";

const ItemList = () => {
    let itemList = [];
    for (let i = 0; i < 30; i++) {
        itemList.push({
            name: 'Pirates of the Caribbean',
            picture: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.gF--XR-CwFzNmC-zfsJD1QHaKu%26pid%3DApi&f=1&ipt=816805543dd762d67ec59cdc3d7db760f2dc029269e4359f9a9d96c783474dd3&ipo=images',
        });
    }

    return (
        <Box
            display='flex'
            flexWrap='wrap'  
            justifyContent='left'  
            gap={3}
        >
            {itemList.map((item, index) => (
               <ItemElem name={item.name} image={item.picture} item_index={index}></ItemElem>
            ))}
        </Box>
    );
}

export default ItemList;
