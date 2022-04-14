import { useContext } from 'react';
import AuthContext from '../auth'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { GlobalStoreContext } from '../store'
import Container from '@mui/material/Container';
import { useState } from 'react'
import { useTheme } from '@mui/system';

const LoginScreen = () => {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [state, setState] = useState("normalLogin");


    const handleLoginSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        auth.loginUser({
            email: formData.get('email'),
            password: formData.get('password'),
        }, store);
    };

    const handleEmailSubmit = (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      auth.getUserSecurityQuestion({
          email: formData.get('email'),
      }, setState, store);
  };

  const handleResetPassword = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    auth.resetPassword({
      email: state.email,
      newPassword: formData.get('password'),
      newPasswordVerify: formData.get('passwordVerify'),
      securityAnswer: formData.get('securityAnswer')
  }, setState, store);
};
const theme = useTheme();

  
    function normalLogin(){
      return (
          <Container component="main" maxWidth="xs">
            <CssBaseline />
              <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: theme.lockIcon.bg}}>
                <LockOutlinedIcon style={{color: theme.lockIcon.color}}/>
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box component="form" onSubmit={handleLoginSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, color: theme.button.text, fontWeight:"bold"}}
                  style={{backgroundColor: theme.button.bg}}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                  <Link component="button" variant="body2" onClick={()=>{
                      setState("enterEmail");
                      }}>
                      {"Forgot password?"}
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/register/" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>)
    }

    function enterEmail(){
      return (
          <Container component="main" maxWidth="xs">
            <CssBaseline />
              <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: theme.lockIcon.bg }}>
                <LockOutlinedIcon style={{color: theme.lockIcon.color}}/>
              </Avatar>
              <Typography component="h1" variant="h5">
                Enter Account Email
              </Typography>
              <Box component="form" onSubmit={handleEmailSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, backgroundColor: theme.button.bg, color: theme.button.text, fontWeight:"bold"}}
                >
                  Continue
                </Button>
              </Box>
            </Box>
          </Container>)
    }


    function resetPassword(){
      return(
      <Container component="main" maxWidth="xs">
        <CssBaseline />
          <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: theme.lockIcon.bg }}>
            <LockOutlinedIcon style={{color: theme.lockIcon.color}}/>
          </Avatar>
          <Typography alignContent="center" component="h1" variant="h5">
            {"Your security Question: " + state.securityQuestion}
          </Typography>
          <Box component="form" onSubmit={handleResetPassword} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="securityAnswer"
              label="Answer"
              name="securityAnswer"
              autoComplete="securityAnswer"
              autoFocus
            />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="New Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <TextField
                  margin="normal"
                    required
                    fullWidth
                    name="passwordVerify"
                    label="New Password Verify"
                    type="password"
                    id="passwordVerify"
                    autoComplete="new-password"
                />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: theme.button.bg, color: theme.button.text, fontWeight:"bold"}}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Container>
    )
      
    }

    function render(){
      if(state === "normalLogin"){
        return normalLogin();
      }
      else if(state === "enterEmail"){
        return enterEmail();
      }
      else{
        return resetPassword();
      }
    }



    return (
      <div className='back'>
        {render()}
      </div>
    );
}

export default LoginScreen;