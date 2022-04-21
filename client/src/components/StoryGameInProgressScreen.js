import TextareaAutosize from '@mui/base/TextareaAutosize';
import { React, useContext, useEffect, useState, useRef } from 'react'
import Painterro from "painterro"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import GlobalGameContext from '../game';
import {gameEvents, gameStatus, gameFailure} from "../game/constants"
import { useHistory } from 'react-router-dom'
import MUIRichTextEditor from "mui-rte";

const StoryGameInProgressScreen = (props) => {
    
    const { game } = useContext(GlobalGameContext);
    const gameRef = useRef(game);
    const [timePerRound, setTimePerRound] = useState(game.timePerRound);


    const decreaseTimer = () =>{
        if(timePerRound > 0){
            setTimeout(() => {
                setTimePerRound(timePerRound-1);
            }, 1000);
        }
    }
    //setup painterro 

    const saveHandler = () =>{
        //save the current text
        gameRef.current.savePanel("TEMP TEXT");
        //reset the text

        //reset the timer
        setTimePerRound(gameRef.current.timePerRound);
    }

    useEffect(() => {
        if(game.gameStatus === gameStatus.START_ROUND){
            //Tell painteroo to save
            console.log("Saving the text!", window.ptro.save);
            //Save the text and reset the timer
            saveHandler();

        }
        else if(game.gameStatus === gameStatus.GAME_OVER){
            console.log("Saving the text!", window.ptro.save);
            //Save the text and reset the timer
            saveHandler();


            setTimeout(() => {
                //save the game
                gameRef.current.saveGame();

            }, 500);
        }
    }, [game.gameStatus]);

    useEffect(() => {
        decreaseTimer();
        gameRef.current = game;
    });

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
                        <Typography mb={2} align="center" variant="h4"> Time left: 30S </Typography>
                        <Typography align="center" variant="h4"> Previous Panel </Typography>
                        <Box noValidate sx={{ border:2, borderColor:"black", height:"60vh", width:"40vw"}}>
                        {gameRef.current.previousPanel === "" || gameRef.current.previousPanel === gameFailure.BLANK_IMAGE_ID ?
                          <div></div>
                          :
                            gameRef.current.previousPanel
                          }
                        </Box>
                    </Box>
                    <Box>
                        <Typography mb={2} align="center" variant="h4"> Round {game.currentRound + 1}/{game.numRounds} </Typography>
                        <Typography align="center" variant="h4"> Current Panel </Typography>
                        <Box id="painterro" class="pa" noValidate sx={{bgcolor:"secondary.main", border:2, borderColor:"black"}}>
                        {/* <TextField placeholder="MultiLine with rows: 2 and rowsMax: 4" multiline style={{height:'100%', width:'100%'}}/> */}
                            {/* <input type="text" style={{height:'100%', width:'100%'}}/> */}
                            <TextareaAutosize
                            rows={40}
                            maxRows={40}
                            aria-label="maximum height"
                            style={{ width:'100%', height:'100%' }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Container>
  </div>
      );
}

export default StoryGameInProgressScreen