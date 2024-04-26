import { TextField } from "@mui/material";

const CustomTextField = (props) => {
    
    const handleChange = (event) => {
    props.onChange(event.target.value);
    };

    return (  
        <TextField
            placeholder={props.placeholder}
            autoComplete={props.autoComplete}
            onChange={handleChange}
            margin="normal"
            variant='outlined'
            size='small'
            required
            sx={{
                '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontFamily: 'Quicksand',
                    '& fieldset': {
                        borderColor: 'white',
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        '& fieldset': {
                            borderColor: 'white',
                            borderWidth: 2,
                        },
                    },
                    '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& fieldset': {
                            borderColor: 'white',
                        },
                    },
                },
                input: {
                    color: 'white',
                    '&::placeholder': {  
                        opacity: 0.9
                    },
                }
                }}
        />
    );
}
 
export default CustomTextField;