import { Box } from "@mui/material";
import CharElem from "./CharElem";

const CharsList = ({charsList}) => {

    return (
        <Box
            display='flex'
            flexDirection='row'
            flexWrap='wrap'
            gap={2}
        >
            {charsList.map((char, index) => (
               <CharElem key={index} name={char.name.full} image={char.image.large} ></CharElem>
            ))}
        </Box>
    );
}

export default CharsList;