import { useContext, useState } from 'react'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { GlobalStoreContext } from '../store'
import api from '../api';


function DeleteModal() {
    const { store } = useContext(GlobalStoreContext);
    //FOR DELETE MODAL
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        console.log("handle close called");
        setOpen(false);
    };
    let gameID = "";
    console.log("currentList: ", store.gameToDelete);
    if (store.gameToDelete) {
        gameID = store.gameToDelete;
    }
    if(gameID !== "" && open !== true){
        handleOpen();
    }
    function handleDeleteList(event) {
        event.stopPropagation();
        store.deleteCard(gameID);
        api.deleteGame(gameID);
        store.handleDelete(null, null);
        handleCloseModal(event);
    }
    function handleCloseModal(event) {
        event.stopPropagation();
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
            >
            <Box sx={style}>
                <Typography variant="h6" component="h2" align="center" width='100%'>
                Delete the game: {gameID}?
                <Box style={{  justifyContent: "space-between", position: "relative"}}>
                <Button  variant="contained" onClick={handleDeleteList} align="left">Delete Game</Button>
                    <Button variant="contained" onClick={handleCloseModal} align="right">Cancel</Button>
                </Box>
                </Typography>
                
            </Box>
            </Modal>
        </div>
    );
}

export default DeleteModal;