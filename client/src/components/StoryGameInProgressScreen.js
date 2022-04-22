import TextareaAutosize from '@mui/base/TextareaAutosize';
import { React, useContext, useEffect, useState, useRef } from 'react'
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
    const [text, setText] = useState("");


    const decreaseTimer = () =>{
        if(timePerRound > 0){
            setTimeout(() => {
                setTimePerRound(timePerRound-1);
            }, 1000);
        }
    }

    const saveHandler = () =>{
        //save the current text
        console.log("Saving the text: ", text);
        gameRef.current.savePanel(text);
        //reset the text
        setText("");
        //reset the timer
        setTimePerRound(gameRef.current.timePerRound);
    }

    useEffect(() => {
        if(game.gameStatus === gameStatus.START_ROUND){
            //Save the text and reset the timer
            saveHandler();
            setTimeout(() => {
                console.log("Calling setPreviousPanel");
                gameRef.current.setPreviousPanel();
            }, 250);
        }
        else if(game.gameStatus === gameStatus.GAME_OVER){
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
                        <Typography mb={2} align="center" variant="h4"> Time left: {timePerRound}S </Typography>
                        <Typography align="center" variant="h4"> Previous Panel </Typography>
                        <Box noValidate sx={{ border:2, borderColor:"black", height:"60vh", width:"40vw"}}>
                        {gameRef.current.previousPanel === "" || gameRef.current.previousPanel === gameFailure.BLANK_TEXT_ID ?
                          ""
                          :
                            gameRef.current.previousPanel
                          }
                        </Box>
                    </Box>
                    <Box>
                        <Typography mb={2} align="center" variant="h4"> Round {game.currentRound + 1}/{game.numRounds} </Typography>
                        <Typography align="center" variant="h4"> Current Panel </Typography>
                        <Box id="painterro" class="pa" noValidate sx={{bgcolor:"secondary.main", border:2, borderColor:"black"}}>
                            <TextareaAutosize
                            rows={40}
                            maxRows={40}
                            aria-label="maximum height"
                            style={{ width:'100%', height:'100%' }}
                            value={text}
                            onChange = {(event) =>{
                                setText(event.target.value);
                            }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Container>
  </div>
      );
}

export default StoryGameInProgressScreen