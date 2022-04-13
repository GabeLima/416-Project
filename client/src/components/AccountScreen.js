import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AuthContext from '../auth';
import api from '../api'
import { useContext } from 'react';
// import CssBaseline from '@mui/material/CssBaseline';

const AccountScreen = () => {
    const { auth } = useContext(AuthContext);

    const changePassword = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await api.changePassword({
            email : auth.user.email,
            password : formData.get('password'),
            newPassword : formData.get('newPassword'),
            newPasswordVerify : formData.get('newPasswordVerify')
        }).then(() => {
            auth.getLoggedIn();
        });
    } 

    const changeUser = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await api.updateUser({
            email : auth.user.email,
            username : formData.get('username'),
            password : formData.get('password')
        }).then(() => {
            auth.getLoggedIn();
        });
    }

    const deleteUser = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await api.removeUser({
            email : formData.get('email'),
            password : formData.get('password')
        }).then(() => {
            auth.logoutUser();
        });
    }
      
    return (
        <div className='back'>
                <Container component="main" maxWidth="lg" maxHeight="lg">
                {/*<CssBaseline />*/}
                <Box pb={5}
                sx={{
                    marginTop: 10,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                >
                    {/*<ThemeProvider theme={leftTheme}>*/}
                    <Box component="form" noValidate sx={{bgcolor:"secondary.main", border:2, borderColor:"black", width:'75%'}} onSubmit={changeUser}>
                        <Box sx={{pt:10}}>
                            <Typography align="center" variant="h4"> Change Username?</Typography>
                        </Box>
                        <TextField margin="normal" required fullWidth id="username" label="New Username" name="username" autoComplete="username" autoFocus/>
                        <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password"/>
                        <Typography align="center">
                                <Button type="submit" variant="contained" sx={{mt: 3, mb: 2, width:'50%', backgroundColor:"#4b4e6d", color:"white", fontWeight:"bold"}}>
                                    Change Username
                                </Button>
                        </Typography>
                        <Box sx={{pt:10}}>
                            <Typography align="center" variant="h4"> Change Password?</Typography>
                        </Box>
                        <TextField margin="normal" required fullWidth name="new-password-1" label="New Password" type="password" id="new-password-1" autoComplete="new-password"/>
                        <TextField margin="normal" required fullWidth name="new-password-2" label="New Password" type="password" id="new-password-2" autoComplete="new-password"/>
                        <TextField margin="normal" required fullWidth name="password" label="Current Password" type="password" id="password" autoComplete="current-password"/>
                        <Typography align="center">
                                <Button  type="submit" variant="contained" sx={{mt: 3, mb: 2, width:'50%', backgroundColor:"#4b4e6d", color:"white", fontWeight:"bold"}}>
                                    Change Password
                                </Button>
                            </Typography>
                    </Box>
                    {/*</ThemeProvider>
                      
            <ThemeProvider theme={rightTheme}>*/}
                    <Box component="form" noValidate sx={{bgcolor:"secondary.main", border:2, borderColor:"black", height: '100%'}} onSubmit={deleteUser}>
                        <Box sx={{pt:10, pb:22}}>
                            <Typography align="center" variant="h4"> Delete Account?</Typography>
                        </Box>
                        <Typography align="center" variant="h6"> {"This action is permanent and CANNOT be undone."}</Typography>
                        <Box  sx={{pt:24.8}}>
                            <TextField margin="normal" required fullWidth id="email" label="Email" name="email" autoComplete="email" autoFocus/>
                            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password"/>
                            <Typography align="center">
                                <Button  type="submit" variant="contained" color="error" sx={{ mt: 3, mb: 2, width:'50%', fontWeight:"bold"}}>
                                    Delete Account
                                </Button>
                            </Typography>
                        </Box>
                        


                        <Grid container>
                        <Grid item xs>
                        </Grid>
                        </Grid>
                    </Box>
                    {/*</ThemeProvider*/}
                </Box>
            </Container>
  </div>

        )
}

export default AccountScreen;