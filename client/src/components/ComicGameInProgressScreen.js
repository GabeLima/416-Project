import { React, useContext, useEffect, useState, useRef } from 'react'
import Painterro from "painterro"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import GlobalGameContext from '../game';
import {gameEvents, gameStatus, gameFailure} from "../game/constants"
import { useHistory } from 'react-router-dom'

const ComicGameInProgressScreen = (props) => {
    
    const { game } = useContext(GlobalGameContext);
    const gameRef = useRef(game);
    const history = useHistory();
    const [timePerRound, setTimePerRound] = useState(game.timePerRound);

    const decreaseTimer = () =>{
        if(timePerRound > 0){
            setTimeout(() => {
                setTimePerRound(timePerRound-1);
            }, 1000);
        }
    }
    //setup painterro 

    useEffect(() => {
        if(game.gameStatus === gameStatus.START_ROUND){
            //Tell painteroo to save
            console.log("Telling ptro to save!", window.ptro.save);
            window.ptro.save();
            setTimeout(() => {
                console.log("Calling setPreviousPanel");
                gameRef.current.setPreviousPanel();
                window.ptro.clear();
            }, 250);
            //window.ptro.show();
        }
        else if(game.gameStatus === gameStatus.GAME_OVER){
            console.log("Telling ptro to save!", window.ptro.save);
            window.ptro.save();
            setTimeout(() => {
                gameRef.current.saveGame();
                //Hide painterro
                window.ptro.hide();

            }, 500);
        }
    }, [game.gameStatus]);

    useEffect(() => {
        decreaseTimer();
        gameRef.current = game;
    });

    useEffect(() => {
        //console.log("history: ", history);
        //Hide the previous painterro instance to prevent bugs.
        if(window.ptro){
            window.ptro.hide();
        }
        //Show a new painterro instance.
        window.ptro = Painterro({
        id: 'painterro',
        defaultTool: "brush",
        hiddenTools: ["crop", "resize", "save", "open", "zoomin", "zoomout", "select", "settings", "pixelize", "close"],
        how_to_paste_actions: ["replace_all"],
        saveHandler: function (image, done){
            console.log("Calling save panel for round: ", gameRef.current.currentRound);
            //console.log("image data url: ", image.asDataURL("image/png", 1));
            gameRef.current.savePanel(image.asDataURL("image/png", 1));
            done(false);
        }
        }).show();
        setTimePerRound(gameRef.current.timePerRound);
    }, [history]);

    return (
        <div>
            <Container component="main" maxWidth="false" maxHeight="lg">
            <Box
            sx={{
                marginTop:15,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}
            >
                <Box>
                    <Typography mb={2} align="center" variant="h4"> Time left: {timePerRound}S </Typography>
                    <Typography align="center" variant="h4"> Previous Panel </Typography>
                    <Box noValidate sx={{ border:2, borderColor:"black", height:"60vh", width:"40vw", backgroundColor:"white"}}>
                          {gameRef.current.previousPanel === "" || gameRef.current.previousPanel === gameFailure.BLANK_IMAGE_ID ?
                          <div></div>
                          :
                          <img width='100%' height='100%' src={gameRef.current.previousPanel}></img> 
                          }
                    </Box>
                </Box>
                <Box>
                    <Typography mb={2} align="center" variant="h4"> Round {game.currentRound + 1}/{game.numRounds} </Typography>
                    <Typography align="center" variant="h4"> Current Panel </Typography>
                    <Box id="painterro" class="pa" noValidate sx={{bgcolor:"secondary.main", border:2, borderColor:"black"}}>
                    </Box>
                </Box>
            </Box>
        </Container>
  </div>
      );
}

export default ComicGameInProgressScreen