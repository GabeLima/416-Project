import { React, useContext, useEffect } from 'react'
import { SocketContext } from "../context/socket";
import Painterro from "painterro"
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/private-theming';

const ComicGameInProgressScreen = (props) => {
    console.log(SocketContext);
    const socket = useContext(SocketContext);
    
    
    let saveHandler = (image, done) => {
        socket.emit("saveImage", image.asBlob());
    }

    useEffect(() => {
        window.ptro = Painterro({
        id: 'painterro',
        defaultTool: "brush",
        hiddenTools: ["crop", "resize", "save", "open", "zoomin", "zoomout", "select", "settings", "pixelize", "close"],
        saveHandler: saveHandler
        }).show();
       });

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
                            <img width='100%' height='100%' src="/images/unknown.png" alt='previous panel'></img> 
                        </Box>
                    </Box>
                    <Box>
                        <Typography mb={2} align="center" variant="h4"> Round 1/n </Typography>
                        <Typography align="center" variant="h4"> Current Panel </Typography>
                        <Box id="painterro" class="pa" noValidate sx={{bgcolor:"secondary.main", border:2, borderColor:"black"}}>
                        </Box>
                    </Box>
                </Box>
            </Container>
    </ThemeProvider>
  </div>
      );
}

export default ComicGameInProgressScreen