import { useContext, useState } from 'react'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { GlobalStoreContext } from '../store'

function AlertModal(props) {
    const { store } = useContext(GlobalStoreContext);
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        console.log("handle close called");
        setOpen(false);
    };
    let name = "";
    let errorMessage = "";
    if(store){
        errorMessage = store.errorMessage;
        if(errorMessage !== null && !open){
            handleOpen();
        }
    }
    if(name !== "" && open !== true){
        handleOpen();
    }
    
    function handleCloseModal(event) {
        event.stopPropagation();
        store.setErrorMessage(null);
        handleClose();
    }
    const style = {
        display: "flex",
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
    return (
        <div>
            <Modal
            open = {open}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" align="center" width='100%'>
                {errorMessage}
                <Box style={{  justifyContent: "space-between", position: "relative"}}>
                <Button variant="contained" onClick={handleCloseModal} align="right">Ok</Button>
                </Box>
                </Typography>
                
            </Box>
            </Modal>
        </div>
    );
}

export default AlertModal;