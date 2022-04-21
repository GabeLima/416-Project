import { React} from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextareaAutosize from '@mui/base/TextareaAutosize';

const StoryGameInProgressScreen = (props) => {
    
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
            console.log("Saving the text!", window.ptro.save);
            //Save the text
            
        }
        else if(game.gameStatus === gameStatus.GAME_OVER){
            console.log("Saving the text!", window.ptro.save);
            //save the text

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
                            {"Sometimes when I get lonely, I think to myself. Why are we really here? Is it to satisfy ourselves? Our greeds? Our desires? Or is it \
                            to justify something else, something bigger, something beyond you or me? Perhaps we exist to satisfy the will of our ancestors. But what \
                            gave them the right to choose my existence?"}
                        </Box>
                    </Box>
                    <Box>
                        <Typography mb={2} align="center" variant="h4"> Round 1/n </Typography>
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