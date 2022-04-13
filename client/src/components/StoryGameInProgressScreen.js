import { React} from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/private-theming';
import TextareaAutosize from '@mui/base/TextareaAutosize';

const StoryGameInProgressScreen = (props) => {
    // const socket = useContext(SocketContext);
    // let saveHandler = (text, done) => {
    //     socket.emit("saveText", text);
    // }

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
                <Container component="main" maxWidth="false" maxHeight="lg">
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
    </ThemeProvider>
  </div>
      );
}

export default StoryGameInProgressScreen