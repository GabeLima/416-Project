import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';

/*
        Original Theme:
        primary main: #6A8D92
        secondary main: #9FB4C7
        background default: #EEEFF

        Option 1:
        primary main: #8ab48e (green)
        primary accent: #dd6e80 (purple)
        secondary main: #9667aa (pink)
        secondary accent: #a4c6e5 (blue)
    */

    const pink = '#dd6e80'
    const green = '#8ab48e'
    const purple = '#9667aa'
    const blue = '#a4c6e5'


    // applies the theme to all components
    // we can potentialyl add other themes later
    const default_theme = createTheme({
      palette: {
          primary: {
            main: blue,
          },
          secondary: {
            main: pink,
          },
          background: {
              default: green,
              accent: '#6A8D92',
              secondary: '#9FB4C7'
          }
      },
      overrides: {
        MuiCssBaseline: {
          "@global": {
            "*, *::before, *::after": {
              boxSizing: "content-box",
            },
    
            body: {
              backgroundColor: purple,
            },
          },
        },
      },
    });


ReactDOM.render(
  
  <React.StrictMode>  
    <ThemeProvider theme={default_theme}>
    <CssBaseline />
        <App />
      </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
