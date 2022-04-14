import { React, useContext, useEffect, useState, useRef } from 'react'
import Painterro from "painterro"
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/private-theming';
import GlobalGameContext from '../game';
import {gameEvents, gameStatus, gameFailure} from "../game/constants"

const ComicGameInProgressScreen = (props) => {
    
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


    
    let saveHandler = (image, done) => {
        console.log("Calling save panel for round: ", game.currentRound);
        //console.log("image data url: ", image.asDataURL("image/png", 1));
        game.savePanel(image.asDataURL("image/png", 1));
        setTimePerRound(game.timePerRound);
        done(true);
    }

    useEffect(() => {
        if(game.gameStatus === gameStatus.START_ROUND){
            //Tell painteroo to save
            console.log("Telling ptro to save!", window.ptro.save);
            window.ptro.save();
            setTimeout(() => {
                console.log("Calling setPreviousPanel");
                gameRef.current.setPreviousPanel();
                window.ptro.clear();
            }, 500);
            //window.ptro.show();
        }
    }, [game.gameStatus]);

    useEffect(() => {
        decreaseTimer();
        gameRef.current = game;
    });

    useEffect(() => {
        window.ptro = Painterro({
        id: 'painterro',
        defaultTool: "brush",
        hiddenTools: ["crop", "resize", "save", "open", "zoomin", "zoomout", "select", "settings", "pixelize", "close"],
        saveHandler: function (image, done){
            console.log("Calling save panel for round: ", gameRef.current.currentRound);
            //console.log("image data url: ", image.asDataURL("image/png", 1));
            gameRef.current.savePanel(image.asDataURL("image/png", 1));
            setTimePerRound(gameRef.current.timePerRound);
            done(false);
        }
        }).show();
    }, []);


    const theme = createTheme({
        palette: {
            primary: {
              main: '#6A8D92',
            },
            secondary: {
              main: '#9FB4C7',
            }
        },
      });
    return (
        <div>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="false">
                <CssBaseline />
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
                        <Typography mb={2} align="center" variant="h4"> Round {game.currentRound + 1}/{game.numRounds + 1} </Typography>
                        <Typography align="center" variant="h4"> Current Panel </Typography>
                        <Box id="painterro" className="pa" noValidate sx={{bgcolor:"secondary.main", border:2, borderColor:"black"}}>
                        </Box>
                    </Box>
                </Box>
            </Container>
    </ThemeProvider>
  </div>
      );
}

export default ComicGameInProgressScreen